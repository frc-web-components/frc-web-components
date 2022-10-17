/* eslint-disable camelcase */
import { SourceProvider } from '@webbitjs/store';
import { NT4_Client, NT4_Topic } from './NT4';

type OnTopicAnnounce = (topic: NT4_Topic) => void;
type OnTopicUnannounce = (topic: NT4_Topic) => void;
type OnNewTopicData = (
  topic: NT4_Topic,
  timestamp_us: number,
  value: unknown
) => void;
type OnConnect = () => void;
type OnDisconnect = () => void;

export default class Nt4Provider extends SourceProvider {
  constructor() {
    super();

    const serverAddr = 'localhost';
    const appName = 'FRC Web Components';
    const onTopicAnnounce: OnTopicAnnounce = (topic: NT4_Topic): void => {
      console.log('onTopicAnnounce:', topic);
    };
    const onTopicUnannounce: OnTopicUnannounce = (topic: NT4_Topic): void => {
      console.log('onTopicUnannounce:', topic);
    };
    const onNewTopicData: OnNewTopicData = (
      topic: NT4_Topic,
      timestamp_us: number,
      value: unknown
    ): void => {
      console.log('onNewTopicData:', { topic, timestamp_us, value });
    };
    const onConnect: OnConnect = (): void => {
      console.log('onConnect');
    };
    const onDisconnect: OnDisconnect = (): void => {
      console.log('onDisconnect');
    };

    const client = new NT4_Client(
      serverAddr,
      appName,
      onTopicAnnounce,
      onTopicUnannounce,
      onNewTopicData,
      onConnect,
      onDisconnect
    );

    client.connect();
    client.subscribeAll(['/'], true);
  }
}
