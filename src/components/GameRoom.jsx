import React, { useState } from 'react';
import { MessageSquare, VenetianMask, UserCheck, Siren, Smartphone, Vote, Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';

const GameRoom = ({ gameData, gameMode, isHost, startVoting, isRoundContinued }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [localActivePlayer, setLocalActivePlayer] = useState(null);
    const [seenPlayers, setSeenPlayers] = useState(
        (gameMode === 'local' && isRoundContinued && gameData?.playersData)
            ? gameData.playersData.map(p => p.username)
            : []
    );

    const toggleVisibility = () => setIsVisible(!isVisible);

    const activeData = (gameMode === 'local' && localActivePlayer) ? localActivePlayer : gameData;
    const showList = gameMode === 'local' && !localActivePlayer;

    const handleConfirmSeen = () => {
        if (localActivePlayer && !seenPlayers.includes(localActivePlayer.username)) {
            setSeenPlayers([...seenPlayers, localActivePlayer.username]);
        }
        setIsVisible(false);
        setLocalActivePlayer(null);
    };

    const allSeen = gameMode === 'local' && gameData?.playersData && seenPlayers.length === gameData.playersData.length;

    return (
        <div className="text-center mt-12 animate-fade-in relative">
            <h1 className="floating flex items-center justify-center gap-4 text-white text-2xl tracking-widest font-display mb-8">
                <div className="w-2.5 h-2.5 bg-danger rounded-full shadow-[0_0_10px_var(--danger)]"></div>
                MISIÓN EN CURSO
                <div className="w-2.5 h-2.5 bg-danger rounded-full shadow-[0_0_10px_var(--danger)]"></div>
            </h1>

            <div className="glass-panel max-w-lg mx-auto p-10 relative overflow-hidden transition-all duration-300">
                {showList ? (
                    <div className="animate-fade-in">
                        <h2 className="text-primary text-2xl mb-2 flex items-center justify-center gap-3 font-display">
                            <Smartphone size={32} /> PASE DE DISPOSITIVO
                        </h2>

                        <p className="text-slate-400 mb-6 text-sm">
                            {allSeen
                                ? "¡Todos han recibido su misión! Es hora de debatir."
                                : "Pasa el dispositivo a cada jugador. Toca tu nombre para ver tu misión secreta."}
                        </p>

                        <div className="grid gap-3 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {gameData?.playersData?.filter(p => p.isAlive !== false).map((p, idx) => {
                                const isSeen = seenPlayers.includes(p.username);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setLocalActivePlayer(p);
                                            setIsVisible(false);
                                        }}
                                        disabled={isSeen}
                                        className={`
                                            p-4 rounded-lg flex items-center justify-between transition-all group text-left border
                                            ${isSeen
                                                ? 'bg-green-500/10 border-green-500/30 opacity-70 hover:opacity-100 cursor-default'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30'
                                            }
                                        `}
                                    >
                                        <span className={`flex items-center gap-3 text-lg font-bold ${isSeen ? 'text-green-400' : 'text-slate-200 group-hover:text-white'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border ${isSeen ? 'bg-green-900/50 border-green-500 text-green-400' : 'bg-slate-700 border-white/10 shrink-0'}`}>
                                                {isSeen ? <UserCheck size={16} /> : (idx + 1)}
                                            </div>
                                            {p.username}
                                        </span>

                                        {isSeen ? (
                                            <span className="text-xs text-green-500 uppercase tracking-widest font-bold flex items-center gap-1 shrink-0">
                                                LISTO <UserCheck size={14} />
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold group-hover:text-primary transition-colors flex items-center gap-1 shrink-0">
                                                Ver <ArrowRight size={14} />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <button
                                className={`btn w-full flex items-center justify-center gap-3 py-4 shadow-lg transition-all duration-300
                                    ${allSeen
                                        ? 'btn-danger shadow-danger/20 animate-pulse-slow transform hover:scale-[1.02]'
                                        : 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-white/5'
                                    }
                                `}
                                onClick={startVoting}
                                disabled={!allSeen}
                            >
                                <Vote size={24} className={allSeen ? 'animate-bounce' : ''} />
                                {allSeen ? "¡EMPEZAR DEBATE!" : "ESPERANDO A TODOS..."}
                            </button>
                            {!allSeen && (
                                <p className="text-xs text-slate-500 mt-2 italic">
                                    Todos los jugadores deben ver su rol antes de iniciar la votación.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h3 className="text-slate-400 mb-2 text-sm font-bold tracking-wider">
                                CATEGORÍA: <span className="text-white">{gameData?.category?.toUpperCase()}</span>
                            </h3>

                            {gameMode === 'local' && (
                                <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm font-mono text-slate-300 mb-2">
                                    Jugador: <b className="text-white">{activeData?.username}</b>
                                </div>
                            )}

                            {gameData?.startingPlayer && (
                                <div className="mt-2 text-center">
                                    <span className="text-primary text-xs uppercase font-bold tracking-widest border border-primary/30 px-3 py-1 rounded-full bg-primary/5">
                                        <MessageSquare size={12} className="inline mr-1" />
                                        Empieza: {gameData.startingPlayer}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="my-6 p-8 bg-black/40 rounded-xl border border-white/10 relative group transition-all duration-300">
                            <div className="flex items-center justify-center mb-6 relative z-10">
                                <p className="text-lg text-slate-400 flex items-center gap-2 m-0 font-medium tracking-wide">
                                    TU MISIÓN SECRETA
                                </p>
                                <button
                                    onClick={toggleVisibility}
                                    className={`
                                        ml-4 p-2 rounded-full transition-all duration-200 border
                                        ${isVisible
                                            ? 'text-primary bg-primary/10 border-primary/30 hover:bg-primary/20'
                                            : 'text-white bg-white/10 border-white/20 hover:bg-white/20 animate-pulse-slow'
                                        }
                                    `}
                                    title={isVisible ? "Ocultar" : "Mostrar"}
                                >
                                    {isVisible ? <EyeOff size={24} /> : <Eye size={24} />}
                                </button>
                            </div>

                            <div className="min-h-[140px] flex items-center justify-center">
                                {isVisible ? (
                                    <div className="fade-in py-2 w-full">
                                        {activeData?.role === 'impostor' ? (
                                            <div className="flex flex-col items-center">
                                                <VenetianMask size={72} className="text-danger mb-4 animate-bounce" />
                                                <h1 className="text-danger text-4xl md:text-5xl font-display tracking-widest animate-pulse mt-2 drop-shadow-[0_0_15px_rgba(255,42,109,0.6)]">
                                                    ERES EL<br />IMPOSTOR
                                                </h1>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center w-full">
                                                <h1 className="text-white text-3xl md:text-5xl font-display tracking-wider mt-2 break-words leading-tight drop-shadow-lg w-full">
                                                    {activeData?.word || "⚠️ SIN DATO"}
                                                </h1>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setIsVisible(true)}
                                        className="cursor-pointer fade-in flex flex-col items-center py-6 select-none opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        <div className="blur-[15px] scale-110 mb-2 select-none pointer-events-none">
                                            <h1 className="text-white text-5xl font-mono tracking-widest m-0">SECRET00</h1>
                                        </div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-2">
                                            (Toca para revelar)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                            {activeData?.role === 'impostor' ? (
                                <p className="text-danger flex items-center justify-center gap-2 text-lg font-medium">
                                    <Lock size={20} /> Misión: Engañar a todos.
                                </p>
                            ) : (
                                <p className="text-primary flex items-center justify-center gap-2 text-lg font-medium">
                                    <UserCheck size={20} /> Pista: Sé sutil con tu descripción.
                                </p>
                            )}
                        </div>

                        <div className="mt-10">
                            {gameMode === 'local' ? (
                                <button
                                    onClick={handleConfirmSeen}
                                    className="btn w-full py-4 border border-white/20 hover:bg-white/10 text-white flex items-center justify-center gap-2 group font-bold tracking-wider"
                                >
                                    <UserCheck size={20} className="text-green-400" />
                                    <span>ENTENDIDO, SIGUIENTE</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                isHost ? (
                                    <button
                                        className="btn btn-danger w-full flex items-center justify-center gap-3 py-3 shadow-lg shadow-danger/20 hover:shadow-danger/40"
                                        onClick={startVoting}
                                    >
                                        <Siren size={24} /> VOTACIÓN
                                    </button>
                                ) : (
                                    <p className="text-slate-400 mt-6 flex items-center justify-center gap-2 italic">
                                        <Vote size={18} /> Esperando orden de votación...
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameRoom;
