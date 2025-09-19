import { types } from 'mediasoup';

export const config = {
  listenIp: '0.0.0.0',
  listenPort: 3010,

  mediasoup: {
    worker: {
      logLevel: 'warn' as types.WorkerLogLevel,
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp',
      ] as types.WorkerLogTag[],
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
    },
    router: {
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000,
          },
        },
      ] as types.RtpCodecCapability[],
    },
    webRtcTransport: {
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: '127.0.0.1', // replace with your server's public IP address
        },
      ],
      initialAvailableOutgoingBitrate: 1000000,
    },
  },
};
