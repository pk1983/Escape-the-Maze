import React from 'react';

type PlayerAssetProps = {
    src: string;   // Source of the player GIF
    size?: number; // Size of the player (optional, defaults to 40px if not provided)
    avatar?: string; // Class name for the avatar
};

const PlayerAsset: React.FC<PlayerAssetProps> = ({ src, size = 20, avatar = "" }) => {
    return (
        <img
            src={src}
            alt="Player icon"
            style={{ width: `${size}px`, height: `${size}px` }}
            className={avatar}
        />
    );
};

export default PlayerAsset;
