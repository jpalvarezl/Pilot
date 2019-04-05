# Pilot

Pilot is a UDP synth to be used alongside [ORCA](https://hundredrabbits.itch.io/orca).

## Install & Run

You can download [builds](https://hundredrabbits.itch.io/orca) for **OSX, Windows and Linux**, or if you wish to build it yourself, follow these steps:

```
git clone https://github.com/hundredrabbits/Pilot.git
cd Pilot/desktop/
npm install
npm start
```

## Commands

### Channel

#### Play

The Play commands allows you to play synth notes.

| Command  | Channel | Octave | Note | Velocity | Length |
| :-       | :-:     | :-:    | :-:  | :-:      | :-:    |
| `04C`    | 0       | 4      | C    | _64_     | _1/16_ |
| `04Cf`   | 0       | 4      | C    | 127      | _1/16_ |
| `04Cff`  | 0       | 4      | C    | 127      | 1bar   |

#### Settings

The Settings commands allow you to change the sound of the synths.

| Command     | Channel      | Name       | Info |
| :-          | :-           | :-         | :-   |                    
| `0ENV:056f` | 0            | Envelope   | Set **Attack**:0.00, **Decay**:0.33, **Sustain**:0.40 and **Release**:1.00 |
| `1WAV:tri ` | 0            | Waveform   | Set **Waveform**:Triangle |

### Global

#### Effects

The Effects are applied to all channels.

| Command     | Channel      | Operation  | Info |
| :-          | :-           | :-         | :-   |
| `CHO9f`     | All          | Chorus     | ..   |
| `TRE9f`     | All          | Tremolo    | ..   |
| `BIT9f`     | All          | Bitcrusher | ..   |
| `CHE9f`     | All          | ?          | ..   |
| `DIS9f`     | All          | Distortion | ..   |
| `DEL9f`     | All          | Delay      | ..   |
| `REV9f`     | All          | Reverb     | ..   |
| `FEE9f`     | All          | Feedback   | ..   |

#### Masters

The Masters are applied in the sequence.

| Command     | Channel      | Operation  | Info |
| :-          | :-           | :-         | :-   |
| `EQUf`      | All          | Equalizer  | ..   | 
| `STEf`      | All          | Stereo     | ..   | 
| `COMf`      | All          | Compressor | ..   | 
| `LIMf`      | All          | Limiter    | ..   | 
| `VOLf`      | All          | Volume     | ..   | 

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
