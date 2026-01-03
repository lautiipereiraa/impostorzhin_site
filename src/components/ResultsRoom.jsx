import React from 'react';
import { Trophy, Skull, RotateCcw, UserX, User, BookOpen, Loader } from 'lucide-react';

const ResultsRoom = ({ gameData, isHost, onPlayAgain }) => {
    const isCrewWin = gameData?.winner === 'crewmates';

    return (
        <div className="text-center mt-12 px-4">
            <h1 className={`text-4xl md:text-6xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 font-display mb-10 ${isCrewWin ? 'text-primary drop-shadow-[0_0_20px_var(--primary)]' : 'text-danger drop-shadow-[0_0_20px_var(--danger)]'}`}>
                {isCrewWin ? <><Trophy size={60} strokeWidth={1.5} /> TRIPULANTES GANAN</> : <><Skull size={60} strokeWidth={1.5} /> EL IMPOSTOR GANA</>}
            </h1>

            <div className="glass-panel max-w-lg mx-auto p-8 animate-fade-in">
                <p className="text-xl mb-3 text-slate-400 flex items-center justify-center gap-2 uppercase tracking-widest font-bold">
                    <UserX size={20} /> El expulsado fue
                </p>
                <h2 className="text-4xl text-danger mb-8 font-display tracking-wider border-b border-white/10 pb-6">{gameData?.eliminated}</h2>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4 mb-8">
                    <p className="flex items-center gap-3 justify-center text-lg">
                        <User size={20} className="text-danger" />
                        El Impostor era: <b className="text-white text-xl">{gameData?.impostorName}</b>
                    </p>
                    <p className="flex items-center gap-3 justify-center text-lg">
                        <BookOpen size={20} className="text-primary" />
                        La Palabra era: <b className="text-primary text-xl">{gameData?.word}</b>
                    </p>
                </div>

                <div className="mt-6">
                    {isHost ? (
                        <button className="btn w-full flex items-center justify-center gap-3 py-4 text-lg shadow-lg hover:shadow-primary/30" onClick={onPlayAgain}>
                            <RotateCcw size={24} /> JUGAR OTRA VEZ
                        </button>
                    ) : (
                        <p className="text-slate-400 italic flex items-center justify-center gap-3 bg-white/5 p-4 rounded-lg">
                            <Loader className="animate-spin" size={20} /> Esperando al Capitán para reiniciar...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsRoom;
