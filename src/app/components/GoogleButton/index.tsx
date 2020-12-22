import React from 'react';
import { Button, Image } from 'antd';

interface Props {
  callback(): void;
}

export const GoogleButton = (props: Props) => {
  const { callback } = props;

  return (
    <Button type="default" block onClick={callback}>
      <Image
        width={25}
        height={25}
        src={require('../../../assets/images/icon_google.png')}
      />
      Use Google Account
    </Button>
  );
};
