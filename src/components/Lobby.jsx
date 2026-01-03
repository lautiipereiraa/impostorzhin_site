import React, { useState } from 'react';
import { Globe, Smartphone, User, Hash, Play, Plus, LogIn, X } from 'lucide-react';

const Lobby = ({ joinGame, createGame, showAlert }) => {
    const [username, setUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [mode, setMode] = useState('online');
    const [localPlayers, setLocalPlayers] = useState(['Jugador 1', 'Jugador 2', 'Jugador 3']);

    const handleCreate = () => {
        if (mode === 'online') {
            if (!username.trim()) {
                showAlert("Falta Información", "¡Ingresa un nombre, tripulante!");
                return;
            }
            createGame(username, 'online');
        } else {
            if (localPlayers.length < 3) {
                showAlert("Pocos Jugadores", "Se necesitan mínimo 3 jugadores para una partida local.");
                return;
            }
            createGame(localPlayers, 'local');
        }
    };

    const handleJoin = () => {
        if (!username.trim() || !roomCode.trim()) {
            showAlert("Faltan Datos", "Necesitas nombre y código para entrar a la nave.");
            return;
        }
        joinGame(username, roomCode);
    };

    const addLocalPlayer = () => setLocalPlayers([...localPlayers, `Jugador ${localPlayers.length + 1}`]);

    const updateLocalPlayer = (index, val) => {
        const newList = [...localPlayers];
        newList[index] = val;
        setLocalPlayers(newList);
    };

    const removeLocalPlayer = (index) => {
        if (localPlayers.length <= 3) return;
        setLocalPlayers(localPlayers.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen relative z-10">
            <div className="glass-panel w-[450px] text-center max-h-[90vh] overflow-y-auto">
                <h1 className="mb-4 text-5xl font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-white leading-tight">
                    IMPOSTOR<br />ZHIN
                </h1>

                <div className="flex bg-black/30 p-[5px] rounded-lg mb-6 gap-[5px]">
                    <button
                        onClick={() => setMode('online')}
                        className={`
                            flex-1 p-3 border-none rounded-md font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300
                            ${mode === 'online' ? 'bg-primary text-black' : 'bg-transparent text-[#8b9bb4]'}
                        `}>
                        <Globe size={18} /> ONLINE
                    </button>
                    <button
                        onClick={() => setMode('local')}
                        className={`
                            flex-1 p-3 border-none rounded-md font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300
                            ${mode === 'local' ? 'bg-primary text-black' : 'bg-transparent text-[#8b9bb4]'}
                        `}>
                        <Smartphone size={18} /> LOCAL
                    </button>
                </div>

                {mode === 'online' ? (
                    <>
                        <div className="mb-8">
                            <label className="flex items-center gap-2 mb-2 text-[#8b9bb4] text-sm justify-start pl-1">
                                <User size={16} /> NOMBRE DEL TRIPULANTE
                            </label>
                            <input
                                type="text"
                                className="input-field text-xl text-center"
                                placeholder="TU NOMBRE"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                maxLength={12}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <button className="btn flex items-center justify-center gap-2.5" onClick={handleCreate}>
                                <Plus size={20} /> CREAR PARTIDA
                            </button>

                            <div className="flex items-center gap-2.5 my-2.5">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-[#5a6b84] text-xs">O UNIRSE</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>

                            <div className="flex gap-2.5">
                                <div className="relative flex-1">
                                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b9bb4]" />
                                    <input
                                        type="text"
                                        className="input-field w-full text-center tracking-widest uppercase pl-8"
                                        placeholder="CÓDIGO"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <button
                                    className="flex-[0.6] border border-white/20 text-white rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors font-bold"
                                    onClick={handleJoin}>
                                    <LogIn size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6 text-left">
                            <p className="text-[#8b9bb4] text-sm mb-2.5 flex items-center gap-2">
                                <User size={16} /> Jugadores:
                            </p>
                            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
                                {localPlayers.map((player, idx) => (
                                    <div key={idx} className="flex gap-1.5">
                                        <input
                                            className="input-field"
                                            value={player}
                                            onChange={(e) => updateLocalPlayer(idx, e.target.value)}
                                            placeholder={`Jugador ${idx + 1}`}
                                        />
                                        {localPlayers.length > 3 && (
                                            <button
                                                onClick={() => removeLocalPlayer(idx)}
                                                className="bg-transparent border-none text-danger cursor-pointer p-0 flex items-center justify-center w-8"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button onClick={addLocalPlayer} className="mt-2.5 w-full bg-white/5 border border-dashed border-[#8b9bb4] text-[#8b9bb4] p-2.5 rounded cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-white/10">
                                <Plus size={16} /> Agregar Jugador
                            </button>
                        </div>
                        <button className="btn flex items-center justify-center gap-2.5 w-full" onClick={handleCreate}>
                            <Play size={20} /> INICIAR
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Lobby;
