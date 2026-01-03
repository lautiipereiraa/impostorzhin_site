import React from 'react';
import TypewriterText from './TypewriterText';
import { Vote, Radio, Target } from 'lucide-react';

const VotingRoom = ({ players, myId, hasVoted, handleVoteClick }) => {
    const me = players.find(p => p.id === myId);
    const amIAlive = me?.isAlive !== false;

    if (!amIAlive) {
        return (
            <div className="text-center mt-20 fade-in">
                <h1 className="text-6xl mb-4">👻</h1>
                <h2 className="text-danger text-3xl font-display uppercase tracking-widest mb-4">Estás Eliminado</h2>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                    Fuiste expulsado de la nave. Ahora eres un fantasma.
                    Observa en silencio cómo tus compañeros intentan sobrevivir.
                </p>
                <div className="glass-panel p-6 max-w-md mx-auto opacity-50 grayscale pointer-events-none select-none">
                    <p className="text-xl flex items-center justify-center gap-2">
                        <Vote size={24} /> Votación en curso...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center mt-12">
            <h1 className="floating text-4xl md:text-5xl font-display text-danger mb-8">¿QUIÉN ES EL IMPOSTOR?</h1>
            {hasVoted ? (
                <div className="glass-panel max-w-xl mx-auto p-10">
                    <h2 className="text-primary mb-6 flex items-center justify-center gap-3 text-2xl font-bold">
                        <Radio size={32} className="animate-pulse" /> VOTO ENVIADO
                    </h2>
                    <div className="text-slate-400 text-lg">
                        <TypewriterText texts={["Transmitiendo datos cifrados...", "Esperando el consenso...", "Calculando traiciones..."]} speed={30} pause={1500} />
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-white mb-6 flex items-center justify-center gap-2 text-xl">
                        <Target size={24} className="text-danger" /> Toca un nombre para acusarlo:
                    </p>

                    <div className="glass-panel max-w-2xl mx-auto flex flex-wrap gap-4 justify-center p-6">
                        {players.map(p => {
                            const isMe = p.id === myId;
                            const isDead = p.isAlive === false;
                            const isDisabled = isMe || isDead;

                            return (
                                <button
                                    key={p.id}
                                    className={`
                                        btn w-[45%] p-5 text-lg border border-white/20 text-white flex items-center justify-center gap-2 transition-all duration-200
                                        ${isDisabled
                                            ? 'opacity-30 cursor-not-allowed bg-transparent border-transparent grayscale'
                                            : 'hover:bg-danger/20 hover:border-danger hover:text-danger hover:shadow-[0_0_15px_var(--danger)]'
                                        }
                                    `}
                                    disabled={isDisabled}
                                    onClick={() => !isDisabled && handleVoteClick(p)}
                                >
                                    {isDead ? <span className="text-danger">☠️</span> : <Vote size={18} className="opacity-70" />}
                                    <span className={isDead ? 'line-through decoration-danger decoration-2' : ''}>{p.username}</span>
                                    {isMe && <span className="text-sm opacity-50 ml-1">(Tú)</span>}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default VotingRoom;
