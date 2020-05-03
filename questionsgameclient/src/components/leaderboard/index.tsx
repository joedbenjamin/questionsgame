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

export const LeaderBoardComp: React.SFC<ILeaderBoardCompProps> = ({
  gameId,
  visible,
  clients,
  clientId,
}) => {
  const places = useMemo(
    () =>
      clients
        .sort((a: any, b: any) => b.score - a.score)
        .map((client: any, index: number) => (
          <Place key={index} isClient={client.id === clientId}>
            <span>{index + 1}</span>
            <span>{client.name}</span>
            <span>{client.score}</span>
          </Place>
        )),
    [clients, clientId],
  );
  return visible ? (
    <React.Fragment>
      <Wrapper>
        <GameIdWRapper>Game ID {gameId}</GameIdWRapper>
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
