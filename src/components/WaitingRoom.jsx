import React, { useState } from 'react';
import TypewriterText from './TypewriterText';
import { Users, Satellite, Crown, X, Rocket, Loader, Shield, Copy, Check } from 'lucide-react';

const WaitingRoom = ({ room, players, myId, isHost, gameMode, startGame, handleKick }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (room) {
            navigator.clipboard.writeText(room);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="text-center text-white mt-12">
            <h2 className="text-5xl font-display flex items-center justify-center gap-4 mb-8">
                <Shield size={40} className="text-primary" />
                SALA: {room}
                <button
                    onClick={handleCopy}
                    title="Copiar código"
                    className={`ml-3 bg-transparent border-none cursor-pointer transition-colors duration-200 flex items-center justify-center ${copied ? 'text-green-400' : 'text-white/70 hover:text-white'}`}
                >
                    {copied ? <Check size={28} /> : <Copy size={28} />}
                </button>
            </h2>

            <div className="glass-panel max-w-2xl mx-auto text-left">
                <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-4">
                    <h3 className="flex items-center gap-2 text-xl font-body">
                        <Users size={20} /> TRIPULACION ({players.length})
                    </h3>
                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 font-bold tracking-wider">
                        <Satellite size={14} />
                        {gameMode === 'online' ? 'ONLINE' : 'LOCAL'}
                    </span>
                </div>

                <ul className="list-none max-h-[300px] overflow-y-auto pr-2 space-y-2">
                    {players.map((p) => {
                        const isMe = gameMode === 'online' ? p.id === myId : false;
                        return (
                            <li key={p.id} className={`
                                p-3 flex items-center justify-between gap-3 rounded-lg border transition-all duration-300
                                ${isMe ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent hover:bg-white/5'}
                            `}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${isMe ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-slate-400'}`}></div>
                                    <span className="text-lg flex items-center gap-2 font-medium">
                                        {p.username}
                                        {isMe && <span className="text-xs opacity-70 italic font-normal">(Tú)</span>}
                                        {p.isHost && <Crown size={18} className="text-yellow-400 fill-yellow-400" />}
                                    </span>
                                </div>

                                {isHost && !p.isHost && (
                                    <button
                                        onClick={() => handleKick(p)}
                                        className="bg-danger/10 border border-danger text-danger hover:bg-danger hover:text-white cursor-pointer p-1.5 rounded-md transition-all duration-200 flex items-center"
                                        title="Expulsar jugador"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-8 text-center">
                    {isHost ? (
                        <>
                            <button className={`
                                w-full text-xl flex items-center justify-center gap-3 py-4 btn
                                ${players.length < 3 ? 'opacity-60 cursor-not-allowed bg-transparent text-slate-400 border border-slate-600' : ''}
                            `}
                                onClick={startGame}
                                disabled={players.length < 3}
                            >
                                {players.length < 3
                                    ? <><Loader className="animate-spin" size={24} /> ESPERANDO TRIPULANTES ({players.length}/3)</>
                                    : <><Rocket size={24} /> INICIAR MISIÓN</>}
                            </button>

                            {players.length < 3 && (
                                <p className="text-slate-400 text-sm mt-4 italic flex items-center justify-center gap-2">
                                    CÓDIGO DE ACCESO:
                                    <span
                                        onClick={handleCopy}
                                        title="Click para copiar"
                                        className={`
                                            text-white tracking-widest bg-white/10 px-2 py-0.5 rounded ml-1 cursor-pointer transition-all duration-200 border
                                            ${copied ? 'border-green-400 text-green-400' : 'border-transparent hover:bg-white/20'}
                                        `}
                                    >
                                        {room}
                                    </span>
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="text-slate-400 italic h-6 flex items-center justify-center">
                            <TypewriterText
                                texts={[
                                    "El Capitán está ajustando los motores...",
                                    "Cargando combustible de materia oscura...",
                                    "Limpiando los ductos de ventilación...",
                                    "Calibrando los sensores de impostores...",
                                    "Esperando a que la tripulación termine su café..."
                                ]}
                                speed={50}
                                pause={3000}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WaitingRoom;
