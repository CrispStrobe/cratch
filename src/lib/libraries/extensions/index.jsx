import React from 'react';
import {FormattedMessage} from 'react-intl';

import musicIconURL from './music/music.png';
import musicInsetIconURL from './music/music-small.svg';


import videoSensingIconURL from './videoSensing/video-sensing.png';
import videoSensingInsetIconURL from './videoSensing/video-sensing-small.svg';

import text2speechIconURL from './text2speech/text2speech.png';
import text2speechInsetIconURL from './text2speech/text2speech-small.svg';

import translateIconURL from './translate/translate.png';
import translateInsetIconURL from './translate/translate-small.png';

import makeymakeyIconURL from './makeymakey/makeymakey.png';
import makeymakeyInsetIconURL from './makeymakey/makeymakey-small.svg';

import microbitIconURL from './microbit/microbit.png';
import microbitInsetIconURL from './microbit/microbit-small.svg';
import microbitConnectionIconURL from './microbit/microbit-illustration.svg';
import microbitConnectionSmallIconURL from './microbit/microbit-small.svg';

import ev3IconURL from './ev3/ev3.png';
import ev3InsetIconURL from './ev3/ev3-small.svg';
import ev3ConnectionIconURL from './ev3/ev3-hub-illustration.svg';
import ev3ConnectionSmallIconURL from './ev3/ev3-small.svg';

import wedo2IconURL from './wedo2/wedo.png'; // TODO: Rename file names to match variable/prop names?
import wedo2InsetIconURL from './wedo2/wedo-small.svg';
import wedo2ConnectionIconURL from './wedo2/wedo-illustration.svg';
import wedo2ConnectionSmallIconURL from './wedo2/wedo-small.svg';
import wedo2ConnectionTipIconURL from './wedo2/wedo-button-illustration.svg';

import boostIconURL from './boost/boost.png';
import boostInsetIconURL from './boost/boost-small.svg';
import boostConnectionIconURL from './boost/boost-illustration.svg';
import boostConnectionSmallIconURL from './boost/boost-small.svg';
import boostConnectionTipIconURL from './boost/boost-button-illustration.svg';

import gdxforIconURL from './gdxfor/gdxfor.png';
import gdxforInsetIconURL from './gdxfor/gdxfor-small.svg';
import gdxforConnectionIconURL from './gdxfor/gdxfor-illustration.svg';
import gdxforConnectionSmallIconURL from './gdxfor/gdxfor-small.svg';

import microbitMoreIconURL from './microbitMore/entry-icon.png';
import microbitMoreInsetIconURL from './microbitMore/inset-icon.svg';
import microbitMoreConnectionIconURL from './microbitMore/connection-icon.svg';
import microbitMoreConnectionSmallIconURL from './microbitMore/connection-small-icon.svg';

import textIconURL from './text/text.png';
import textInsetIconURL from './text/text-small.svg';

import pmIconURL from './pm/pm.png';
import pmInsetIconURL from './pm/pm-small.svg';

import bodydetectionIconURL from './bodydetection/bodydetection.png';
import bodydetectionInsetIconURL from './bodydetection/bodydetection-small.svg';

import qrcodeIconURL from './qrcode/qrcode.png';
import qrcodeInsetIconURL from './qrcode/qrcode-small.svg';


import tmIconURL from './tm/tm.png';
import tmInsetIconURL from './tm/tm-small.png';


import facemeshIconURL from './facemesh/facemesh.png';
import facemeshInsetIconURL from './facemesh/facemesh-small.svg';

import handposeIconURL from './handpose/handpose.png';
import handposeInsetIconURL from './handpose/handpose-small.svg';

import mlIconURL from './ml/ml.png';
import mlInsetIconURL from './ml/ml-small.svg';

export default [
    {
  name: (
            <FormattedMessage
                defaultMessage="Machine Learning"
                description=""
                id="gui.extension.ml.name"
            />
        ),
  extensionId: 'ml',
  collaborator: '',
  iconURL: mlIconURL,
  insetIconURL: mlInsetIconURL,
  description: (
    <FormattedMessage
      defaultMessage="Machine Learning"
      description=""
      id="gui.extension.ml.description"
    />
  ),
  featured: true,
  disabled: false,
  bluetoothRequired: false,
  internetConnectionRequired: false


},
    {
        name: (
            <FormattedMessage
                defaultMessage="Teachable machine"
                description=""
                id="gui.extension.tm.name"
            />
        ),
        extensionId: 'tm',
        collaborator: '',
        iconURL: tmIconURL,
        insetIconURL: tmInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage='Train a model on Teachable Machine and use it in your code.'
                description=''
                id='gui.extension.tm.description'
            />
        ),
        featured: true,
        internetConnectionRequired: true,
        bluetoothRequired: false
    },

     {
        name: (
            <FormattedMessage
                defaultMessage="Body Detection"
                description=""
                id="gui.extension.bodydetection.name"
            />
        ),
        extensionId: 'bodydetection',
        iconURL: bodydetectionIconURL,
        insetIconURL: bodydetectionInsetIconURL,
        collaborator: '',
        description: (
            <FormattedMessage
                defaultMessage="PoseNet use to detect body parts."
                description=""
                id="gui.extension.bodydetection.description"
            />
        ),
        featured: true
    },



{
   name: (
            <FormattedMessage
                defaultMessage="Handpose"
                description=""
                id="gui.extension.handpose.name"
            />
        ),
  extensionId: 'handpose',
  collaborator: '',
  iconURL: handposeIconURL,
  insetIconURL: handposeInsetIconURL,
  description: (
    <FormattedMessage
      defaultMessage="Handpose with PoseNet"
      description=""
      id="gui.extension.handpose.description"
    />
  ),
  featured: true,
  disabled: false,
  bluetoothRequired: false,
  internetConnectionRequired: false

},
{
   name: (
            <FormattedMessage
                defaultMessage="Facemesh"
                description=""
                id="gui.extension.facemesh.name"
            />
        ),
  extensionId: 'facemesh',
  collaborator: '',
  iconURL: facemeshIconURL,
  insetIconURL: facemeshInsetIconURL,
  description: (
    <FormattedMessage
      defaultMessage="Facemesh with PoseNet"
      description=""
      id="gui.extension.facemesh.description"
    />
  ),
  featured: true,
  disabled: false,
  bluetoothRequired: false,
  internetConnectionRequired: false

},


    {
           name: (
            <FormattedMessage
                defaultMessage="QRCode"
                description=""
                id="gui.extension.qrcode.name"
            />
        ),
        extensionId: 'qrcode',
        collaborator: '',
        iconURL: qrcodeIconURL,
        insetIconURL: qrcodeInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage='QRCode Scanner'
                description=''
                id="gui.extension.qrcode.description"
            />
        ),
        featured: true,
        disabled: false,
        internetConnectionRequired: false,
        bluetoothRequired: false
    },


{
        name: (
            <FormattedMessage
                defaultMessage="Maths Planet"
                description="Planète maths"
                id="gui.extension.planetemaths.name"
            />
        ),
        extensionId: 'planetemaths',
        iconURL: pmIconURL,
        insetIconURL: pmInsetIconURL,
        collaborator: 'Planète Maths',
        description: (
            <FormattedMessage
                defaultMessage="Use mathematics tools."
                description=""
                id="gui.extension.planetemaths.description"
            />
        ),
        featured: true
    },
        {
  name: <FormattedMessage
                defaultMessage="Animated Text"
                description="Animated Text"
                id="gui.extension.text.name"
            />,
  extensionId: 'text',
  iconURL: textIconURL,
  insetIconURL: textInsetIconURL,
  description: (
            <FormattedMessage
                defaultMessage="Bring words to life."
                description="Description for the 'Animated Text' extension"
                id="gui.extension.text.description"
            />
        ),
  featured: true
},
    {
        name: (
            <FormattedMessage
                defaultMessage="Music"
                description="Name for the 'Music' extension"
                id="gui.extension.music.name"
            />
        ),
        extensionId: 'music',
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Play instruments and drums."
                description="Description for the 'Music' extension"
                id="gui.extension.music.description"
            />
        ),
        featured: true
    },
 
    {
        name: (
            <FormattedMessage
                defaultMessage="Video Sensing"
                description="Name for the 'Video Sensing' extension"
                id="gui.extension.videosensing.name"
            />
        ),
        extensionId: 'videoSensing',
        iconURL: videoSensingIconURL,
        insetIconURL: videoSensingInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Sense motion with the camera."
                description="Description for the 'Video Sensing' extension"
                id="gui.extension.videosensing.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Text to Speech"
                description="Name for the Text to Speech extension"
                id="gui.extension.text2speech.name"
            />
        ),
        extensionId: 'text2speech',
        collaborator: 'Amazon Web Services',
        iconURL: text2speechIconURL,
        insetIconURL: text2speechInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make your projects talk."
                description="Description for the Text to speech extension"
                id="gui.extension.text2speech.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Translate"
                description="Name for the Translate extension"
                id="gui.extension.translate.name"
            />
        ),
        extensionId: 'translate',
        collaborator: 'Google',
        iconURL: translateIconURL,
        insetIconURL: translateInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Translate text into many languages."
                description="Description for the Translate extension"
                id="gui.extension.translate.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
     
{
        name: 'Microbit',
        extensionId: 'microbitMore',
        collaborator: 'Yengawa Lab',
        iconURL: microbitMoreIconURL,
        insetIconURL: microbitMoreInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage='Play with all functions of micro:bit. (v2-0.2.4)'
                description='Description for the Microbit More extension'
                id='gui.extension.microbitmore.description'
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: microbitMoreConnectionIconURL,
        connectionSmallIconURL: microbitMoreConnectionSmallIconURL,
        connectingMessage: (
           <FormattedMessage
               defaultMessage='Connecting'
               description='Message to help people connect to their micro:bit.'
               id='gui.extension.microbit.connectingMessage'
           />
        ),
        helpLink: 'https://microbit-more.github.io/'
    },
    {
        name: 'Makey Makey',
        extensionId: 'makeymakey',
        collaborator: 'JoyLabz',
        iconURL: makeymakeyIconURL,
        insetIconURL: makeymakeyInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make anything into a key."
                description="Description for the 'Makey Makey' extension"
                id="gui.extension.makeymakey.description"
            />
        ),
        featured: true
    },
    
    {
        name: 'LEGO MINDSTORMS EV3',
        extensionId: 'ev3',
        collaborator: 'LEGO',
        iconURL: ev3IconURL,
        insetIconURL: ev3InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build interactive robots and more."
                description="Description for the 'LEGO MINDSTORMS EV3' extension"
                id="gui.extension.ev3.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: ev3ConnectionIconURL,
        connectionSmallIconURL: ev3ConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting. Make sure the pin on your EV3 is set to 1234."
                description="Message to help people connect to their EV3. Must note the PIN should be 1234."
                id="gui.extension.ev3.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/ev3'
    },
    {
        name: 'LEGO BOOST',
        extensionId: 'boost',
        collaborator: 'LEGO',
        iconURL: boostIconURL,
        insetIconURL: boostInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Bring robotic creations to life."
                description="Description for the 'LEGO BOOST' extension"
                id="gui.extension.boost.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: boostConnectionIconURL,
        connectionSmallIconURL: boostConnectionSmallIconURL,
        connectionTipIconURL: boostConnectionTipIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their BOOST."
                id="gui.extension.boost.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/boost'
    },
    {
        name: 'LEGO Education WeDo 2.0',
        extensionId: 'wedo2',
        collaborator: 'LEGO',
        iconURL: wedo2IconURL,
        insetIconURL: wedo2InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build with motors and sensors."
                description="Description for the 'LEGO WeDo 2.0' extension"
                id="gui.extension.wedo2.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: wedo2ConnectionIconURL,
        connectionSmallIconURL: wedo2ConnectionSmallIconURL,
        connectionTipIconURL: wedo2ConnectionTipIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their WeDo."
                id="gui.extension.wedo2.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/wedo'
    },
    {
        name: 'Go Direct Force & Acceleration',
        extensionId: 'gdxfor',
        collaborator: 'Vernier',
        iconURL: gdxforIconURL,
        insetIconURL: gdxforInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Sense push, pull, motion, and spin."
                description="Description for the Vernier Go Direct Force and Acceleration sensor extension"
                id="gui.extension.gdxfor.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: gdxforConnectionIconURL,
        connectionSmallIconURL: gdxforConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their force and acceleration sensor."
                id="gui.extension.gdxfor.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/vernier'
    }
];
