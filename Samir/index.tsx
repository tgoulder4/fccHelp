import { useState, useEffect } from 'react';

export enum Action {
    EAT = 'EAT',
    PLAY = 'PLAY',
    SLEEP = 'SLEEP',
}

export enum PetMood {
    HAPPY = 'HAPPY',
    EXCITED = 'EXCITED',
    CONTENT = 'CONTENT',
    SAD = 'SAD',
    TIRED = 'TIRED',
    SICK = 'SICK',
    HUNGRY = 'HUNGRY',
}

export const MOOD_VISUALS: Record<PetMood, string> = {
    [PetMood.HAPPY]: '😊',
    [PetMood.EXCITED]: '🤩',
    [PetMood.CONTENT]: '🙂',
    [PetMood.SAD]: '😢',
    [PetMood.TIRED]: '😴',
    [PetMood.SICK]: '🤢',
    [PetMood.HUNGRY]: '🤤',
};

export const App: React.FC = () => {
    const [petName, setPetName] = useState<string>('');
    const [hasStarted, setHasStarted] = useState<boolean>(false);

    const [hunger, setHunger] = useState<number>(0);
    const [energy, setEnergy] = useState<number>(100);
    const [happiness, setHappiness] = useState<number>(100);

    useEffect(() => {
        if (!hasStarted) return;

        const interval = setInterval(() => {
            setHunger((prev) => Math.min(100, prev + 5));
            setEnergy((prev) => Math.min(100, prev + 5));
            setHappiness((prev) => Math.max(0, prev - 5));
        }, 1000);

        return () => clearInterval(interval);
    }, [hasStarted]);

    const getPetMood = (): PetMood => {
        if (hunger > 70 && energy < 30) return PetMood.SICK;
        if (hunger > 70) return PetMood.HUNGRY;
        if (energy < 30) return PetMood.TIRED;
        if (happiness < 30) return PetMood.SAD;
        if (happiness > 80 && energy > 70) return PetMood.EXCITED;
        if (happiness > 60) return PetMood.HAPPY;
        return PetMood.CONTENT;
    };

    const handleAction = (action: Action) => {
        if (action === Action.EAT) {
            if (hunger > 0) setHunger((prev) => Math.max(0, prev - 10));
            if (energy < 100) setEnergy((prev) => Math.min(100, prev + 10));
        } else if (action === Action.PLAY) {
            if (energy > 0) setEnergy((prev) => Math.max(0, prev - 10));
            if (happiness < 100) setHappiness((prev) => Math.min(100, prev + 10));
        } else if (action === Action.SLEEP) {
            if (hunger < 100) setHunger((prev) => Math.min(100, prev + 10));
            if (energy < 100) setEnergy((prev) => Math.min(100, prev + 10));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (petName.trim()) {
            setHasStarted(true);
        }
    };

    const currentMood = getPetMood();

    return (
        <div className="pet-game-app">
            {!hasStarted ? (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="pet-name">Pet Name:</label>
                    <input
                        id="pet-name"
                        type="text"
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                    />
                    <button type="submit">Start Game</button>
                </form>
            ) : (
                <div className="game-container">
                    <div className="pet-name">{petName}</div>
                    <div className="pet-mood">{MOOD_VISUALS[currentMood]}</div>
                    <p className="mood-text">{currentMood}</p>

                    <div className="stats-container">
                        <div className="stat">
                            Hunger <span className="stat-value">{hunger}</span>
                        </div>
                        <div className="stat">
                            Energy <span className="stat-value">{energy}</span>
                        </div>
                        <div className="stat">
                            Happiness <span className="stat-value">{happiness}</span>
                        </div>
                    </div>

                    <div className="actions">
                        <button id="eat-action" onClick={() => handleAction(Action.EAT)}>Eat</button>
                        <button id="play-action" onClick={() => handleAction(Action.PLAY)}>Play</button>
                        <button id="sleep-action" onClick={() => handleAction(Action.SLEEP)}>Sleep</button>
                    </div>
                </div>
            )}
        </div>
    )
}