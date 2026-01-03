import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import Lobby from './components/Lobby'
import Modal from './components/Modal'
import WaitingRoom from './components/WaitingRoom'
import GameRoom from './components/GameRoom'
import VotingRoom from './components/VotingRoom'
import ResultsRoom from './components/ResultsRoom'
import { Loader, LogOut } from 'lucide-react';
import './App.css'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const socket = io(SOCKET_URL);

function App() {
  const [gameState, setGameState] = useState('lobby');
  const [room, setRoom] = useState('');
  const [players, setPlayers] = useState([]);
  const [myId, setMyId] = useState('');
  const [gameData, setGameData] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gameMode, setGameMode] = useState('online');
  const [roundContinued, setRoundContinued] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isRecovering, setIsRecovering] = useState(true);
  const [results, setResults] = useState(null);

  const stateRef = useRef({ gameState, gameMode });
  useEffect(() => {
    stateRef.current = { gameState, gameMode };
  }, [gameState, gameMode]);

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Cancelar',
    theme: 'primary'
  });

  const showModal = (options) => {
    setModal({
      isOpen: true,
      title: options.title || '',
      message: options.message || '',
      onConfirm: () => {
        if (options.onConfirm) options.onConfirm();
        closeModal();
      },
      onCancel: options.onCancel ? () => {
        options.onCancel();
        closeModal();
      } : null,
      confirmText: options.confirmText || 'OK',
      cancelText: options.cancelText || 'Cancelar',
      theme: options.theme || 'primary'
    });
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
  const showAlert = (title, message) => showModal({ title, message, onConfirm: () => { } });

  useEffect(() => {
    const savedSession = sessionStorage.getItem('impostorzhin_session');
    if (savedSession) {
      try {
        const { roomCode, username } = JSON.parse(savedSession);
        socket.emit('join_room', { username, roomCode });
      } catch (e) { console.error(e); }
    }
    setTimeout(() => setIsRecovering(false), 1500);

    socket.on('connect', () => setMyId(socket.id));

    socket.on('room_joined', (data) => {
      setIsRecovering(false);
      if (data.roomCode) {
        setRoom(data.roomCode);
        setPlayers(data.players);
        setIsHost(data.isHost);
        setGameMode(data.gameMode);
        setGameState(prev => (prev === 'lobby' ? 'waiting' : prev));
        setRoundContinued(false);

        const me = data.players.find(p => p.socketId === socket.id || p.id === socket.id);
        if (me) {
          sessionStorage.setItem('impostorzhin_session', JSON.stringify({
            roomCode: data.roomCode,
            username: me.username
          }));
        }
      } else {
        setGameState('lobby');
        setRoom('');
        sessionStorage.removeItem('impostorzhin_session');
      }
    });

    socket.on('player_update', (updatedPlayers) => {
      setPlayers(updatedPlayers);
      const me = updatedPlayers.find(p => p.socketId === socket.id || p.id === socket.id);
      if (me) setIsHost(me.isHost);
    });

    socket.on('game_started', (data) => {
      setGameData(data);
      setGameState('game');
      setRoundContinued(false);
    });

    socket.on('local_game_data', (localData) => {
      setGameData(localData);
      setGameState('game');
      setRoundContinued(false);
    });

    socket.on('your_role', (roleData) => {
      setGameData(prev => ({ ...prev, ...roleData }));
    });

    socket.on('voting_started', (data) => {
      setGameState('voting');
      setHasVoted(data?.hasVoted || false);
    });

    socket.on('round_continued', (data) => {
      setPlayers(data.players);
      setGameData(prev => {
        if (!prev || !prev.playersData) return prev;
        const updated = prev.playersData.map(lp => {
          const sp = data.players.find(s => s.id === lp.id);
          return sp ? { ...lp, isAlive: sp.isAlive } : lp;
        });
        return { ...prev, playersData: updated };
      });
      if (data.isTie) showAlert("EMPATE", "Nadie fue expulsado. Continúa el debate.");
      else showAlert("INOCENTE", `${data.eliminated} era inocente. Busquen al impostor.`);
      setGameState('game');
      setRoundContinued(true);
    });

    socket.on('game_results', (res) => {
      setResults(res);
      setGameState('results');
    });

    socket.on('back_to_lobby', (data) => {
      if (data.players) setPlayers(data.players);
      setGameState('waiting');
      setGameData(null);
      setResults(null);
      setRoundContinued(false);
    });

    socket.on('game_terminated', (data) => {
      showAlert("MISIÓN ABORTADA", data.message);
      setGameState('waiting');
      setRoundContinued(false);
    });

    socket.on('error', (msg) => showAlert("Nota", msg));

    return () => {
      socket.off('connect');
      socket.off('room_joined');
      socket.off('player_update');
      socket.off('game_started');
      socket.off('local_game_data');
      socket.off('your_role');
      socket.off('voting_started');
      socket.off('round_continued');
      socket.off('game_results');
      socket.off('back_to_lobby');
      socket.off('game_terminated');
      socket.off('error');
    };
  }, []);

  useEffect(() => {
    if (gameState === 'waiting' && gameMode === 'local' && isHost && players.length >= 3) {
      socket.emit('start_game', { roomCode: room });
    }
  }, [gameState, gameMode, isHost, players.length, room]);

  const createGame = (input, mode) => {
    socket.emit('create_room', {
      gameMode: mode,
      initialPlayers: mode === 'local' ? input : null,
      username: mode === 'online' ? input : null
    });
  };

  const joinGame = (user, code) => socket.emit('join_room', { username: user, roomCode: code });
  const startGame = () => socket.emit('start_game', { roomCode: room });
  const startVoting = () => socket.emit('start_voting', { roomCode: room });

  const handleVoteClick = (player) => {
    showModal({
      title: "Expulsar",
      message: `¿Expulsar a ${player.username}?`,
      confirmText: "CONFERMAR",
      theme: 'danger',
      onConfirm: () => {
        if (gameMode === 'local') {
          socket.emit('local_elimination', { roomCode: room, eliminatedPlayerId: player.id });
        } else {
          socket.emit('cast_vote', { roomCode: room, votedPlayerId: player.id });
          setHasVoted(true);
        }
      }
    });
  };

  const handleKick = (p) => socket.emit('kick_player', { roomCode: room, playerId: p.id });
  const handlePlayAgain = () => socket.emit('play_again', { roomCode: room });

  const leaveGame = () => {
    showModal({
      title: "Abandonar",
      message: "¿Quieres salir de la nave?",
      confirmText: "Salir",
      theme: 'danger',
      onConfirm: () => {
        socket.emit('leave_room', { roomCode: room });
        sessionStorage.removeItem('impostorzhin_session');
        setGameState('lobby');
        setRoom('');
        setPlayers([]);
        setGameData(null);
        setResults(null);
      }
    });
  };

  if (isRecovering) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-transparent">
        <Loader size={60} className="animate-spin text-primary mb-4" />
        <p className="text-slate-400 font-display tracking-widest animate-pulse">Sincronizando...</p>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen bg-transparent overflow-hidden">
      <Modal isOpen={modal.isOpen} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onCancel={modal.onCancel} confirmText={modal.confirmText} theme={modal.theme} />

      {gameState !== 'lobby' && (
        <button onClick={leaveGame} className="fixed top-6 right-6 bg-black/40 border border-danger/30 text-danger p-3 rounded-full z-[100] hover:bg-danger/10 transition-colors">
          <LogOut size={22} />
        </button>
      )}

      {gameState === 'lobby' && <Lobby createGame={createGame} joinGame={joinGame} showAlert={showAlert} />}
      {gameState === 'waiting' && <WaitingRoom room={room} players={players} myId={myId} isHost={isHost} gameMode={gameMode} startGame={startGame} handleKick={handleKick} socket={socket} />}
      {gameState === 'game' && <GameRoom gameData={gameData} gameMode={gameMode} isHost={isHost} startVoting={startVoting} isRoundContinued={roundContinued} />}
      {gameState === 'voting' && <VotingRoom players={gameMode === 'local' ? (gameData?.playersData || players) : players} myId={myId} hasVoted={hasVoted} handleVoteClick={handleVoteClick} />}
      {gameState === 'results' && <ResultsRoom gameData={{ ...gameData, ...results }} isHost={isHost} onPlayAgain={handlePlayAgain} />}
    </div>
  );
}

export default App;
