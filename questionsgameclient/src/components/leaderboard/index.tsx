import React, { useMemo } from 'react';
import {
  GameIdWRapper,
  LeaderBoard,
  LeaderBoardWrapper,
  Place,
  PlaceHeader,
  Wrapper,
} from './styles';

interface ILeaderBoardCompProps {
  gameId: string;
  visible: boolean;
  clients: any[];
  clientId: string;
}

const LeaderBoardComp: React.SFC<ILeaderBoardCompProps> = ({
  gameId,
  visible,
  clients,
  clientId,
}) => {
  const places = useMemo(() => {
    const me = clients.filter((c) => c.id === clientId);
    const rest = clients.filter((c) => c.id !== clientId).slice(0, 2);
    let last: any = {};
    let position: number = 0;

    return [...me, ...rest]
      .sort((a: any, b: any) => b.score - a.score)
      .map((client: any) => {
        const result = (
          <Place key={client.id} isClient={client.id === clientId}>
            <span>
              {last && last?.score === client.score ? position : ++position}
            </span>
            <span>{client.name}</span>
            <span>{client.score}</span>
          </Place>
        );
        last = client;
        return result;
      });
  }, [clients, clientId]);

  return visible ? (
    <React.Fragment>
      <Wrapper>
        <GameIdWRapper>
          {gameId === '-1' ? 'Game Over' : `Game ID ${gameId}`}
        </GameIdWRapper>
        <LeaderBoardWrapper>
          <LeaderBoard>
            <PlaceHeader>
              <span>Place</span>
              <span>Name</span>
              <span>Score</span>
            </PlaceHeader>
            {places}
          </LeaderBoard>
        </LeaderBoardWrapper>
      </Wrapper>
    </React.Fragment>
  ) : null;
};

export default LeaderBoardComp;
