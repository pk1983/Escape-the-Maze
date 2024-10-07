import React from 'react';

type GameAssetProps = {
    direction: 'up' | 'down' | 'left' | 'right';
};

const GameAsset: React.FC<GameAssetProps> = ({ direction }) => {
    // Map the direction to the corresponding GIF file
    const assetMap = {
        up: '/assets/game/up-arrow.gif',
        down: '/assets/game/down-arrow.gif',
        left: '/assets/game/left-arrow.gif',
        right: '/assets/game/right-arrow.gif',
    };

    return (
        <img
            src={assetMap[direction]}
            alt={`${direction} icon`}
            className="w-10 h-10"
        />
    );
};

export default GameAsset;
