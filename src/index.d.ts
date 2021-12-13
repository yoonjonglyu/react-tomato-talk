import React from 'react';

declare module 'react-tomato-talk' {
    const ReactTomatoTalk: ReactTomatoTalk

    interface ReactTomatoTalk {
        (config: ReactTomatoTalkProps): React.FC
    }

    interface ReactTomatoTalkProps {
        url: string
    }

    export default ReactTomatoTalk;
}