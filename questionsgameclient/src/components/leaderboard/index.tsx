import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useStyles, StyledTableRow, StyledTableCell } from './styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

interface ILeaderBoardCompProps {
  gameId: string;
  visible: boolean;
  clients: any[];
  clientId: string;
}

const LeaderBoardComp: React.SFC<ILeaderBoardCompProps> = ({
  visible,
  clients,
  clientId,
}) => {
  const classes = useStyles();
  const places = useMemo(() => {
    const me = clients.filter((c) => c.id === clientId);
    const rest = clients.filter((c) => c.id !== clientId); //.slice(0, 2);
    let last: any = {};
    let position: number = 0;
    return [...me, ...rest]
      .sort((a: any, b: any) => b.score - a.score)
      .map((client: any) => {
        const result = (
          <StyledTableRow key={client.id}>
            <StyledTableCell align="center">
              {clientId === client.id ? (
                <AccountCircleIcon color="secondary" />
              ) : null}
            </StyledTableCell>
            <StyledTableCell align="center">
              {last && last?.score === client.score ? position : ++position}
            </StyledTableCell>
            <StyledTableCell align="center">{client.name}</StyledTableCell>
            <StyledTableCell align="center">{client.score}</StyledTableCell>
          </StyledTableRow>
        );
        last = client;
        return result;
      });
  }, [clients, clientId]);

  return visible ? (
    <React.Fragment>
      <TableContainer>
        <Table className={classes.table} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" />
              <StyledTableCell align="center">Place</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Score</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{places}</TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  ) : null;
};

export default LeaderBoardComp;
