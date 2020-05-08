import Tooltip from '@material-ui/core/Tooltip';
import { Button } from '@material-ui/core';
import copy from 'clipboard-copy';
import React, { useState } from 'react';

interface ICopyProps {
  joinGameId: string;
  visible: boolean;
}

const Copy: React.SFC<ICopyProps> = ({ joinGameId, visible }) => {
  const [showToolTip, setShowToolTip] = useState(false);
  const copyGameId = (_: any) => {
    setShowToolTip(true);
    copy(joinGameId);
  };

  return visible ? (
    <Tooltip
      open={showToolTip}
      title={'GameId has been copied!!!'}
      leaveDelay={2000}
      onClose={() => setShowToolTip(false)}>
      <Button variant="contained" color="primary" onClick={copyGameId}>
        Copy Game Id
      </Button>
    </Tooltip>
  ) : null;
};

export default Copy;
