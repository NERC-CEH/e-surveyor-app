import { Network } from '@capacitor/network';
import { observable } from 'mobx';

const status = observable({ isOnline: true });

Network.addListener('networkStatusChange', ({ connected }) => {
  status.isOnline = connected;
  console.log('Network status:', connected ? 'online' : 'offline');
});

(async () => {
  const { connected } = await Network.getStatus();
  status.isOnline = connected;
  console.log('Network status:', connected ? 'online' : 'offline');
})();

export default status;
