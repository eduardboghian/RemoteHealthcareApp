import React from 'react'
import Video from 'twilio-video'
import axios from 'axios'
import './index.css'


export default function VideoRoom(props) {

    let activeRoom
    let previewTracks
    let identity
    let roomName

    

    // When we are about to transition away from this page, disconnect
    // from the room, if joined.    
    window.addEventListener('beforeunload', leaveRoomIfJoined)

    // Obtain a token from the server in order to connect to the Room.
    axios.get(`/api/token/${props.match.params.name}`)
    .then( data=> {
        console.log(data)
        identity = data.data.identity
        document.getElementById('room-controls').style.display = 'block'

        // Bind button to join Room.
        document.getElementById('button-join').onclick = function() {
            roomName = props.match.params.did+props.match.params.pid
            if (!roomName) {
                alert('Please enter a room name.')
                return
            }

            console.log("Joining room '" + roomName + "'...")
                let connectOptions = {
                name: roomName,
                logLevel: 'debug'
            };

            if (previewTracks) {
                connectOptions.tracks = previewTracks
            }

            // Join the Room with the token from the server and the
            // LocalParticipant's Tracks.
            Video.connect(data.data.token).then(roomJoined, function(error) {
                console.log('Could not connect to Twilio: ' + error.message)
            })
        }

        // Bind button to leave Room.
        document.getElementById('button-leave').onclick = function() {
            console.log('Leaving room...')
            activeRoom.disconnect()
        }

    })
    .catch(err=> console.log(err))

    // Attach the Tracks to the DOM.
    function attachTracks(tracks, container) {
        tracks.forEach(function(track) {
            container.appendChild(track.attach())
        })
    }
    
    // Attach the Participant's Tracks to the DOM.
    function attachParticipantTracks(participant, container) {
        let tracks = Array.from(participant.tracks.values())
        attachTracks(tracks, container)
    }
    
    // Detach the Tracks from the DOM.
    function detachTracks(tracks) {
        tracks.forEach(function(track) {
            track.detach().forEach(function(detachedElement) {
                detachedElement.remove()
            })
        })
    }

    // Detach the Participant's Tracks from the DOM.
    function detachParticipantTracks(participant) {
        let tracks = Array.from(participant.tracks.values())
        detachTracks(tracks)
    }

    //Scuccesully connected
    function roomJoined(room) {
        window.room = activeRoom = room
      
        console.log("Joined as '" + identity + "'")
        document.getElementById('button-join').style.display = 'none'
        document.getElementById('button-leave').style.display = 'inline'
      
        // Attach LocalParticipant's Tracks, if not already attached.
        let previewContainer = document.getElementById('local-media')
        if (!previewContainer.querySelector('video')) {
          attachParticipantTracks(room.localParticipant, previewContainer)
        }
      
        // Attach the Tracks of the Room's Participants.
        room.participants.forEach(function(participant) {
          console.log("Already in Room: '" + participant.identity + "'")
          let previewContainer = document.getElementById('remote-media')
          attachParticipantTracks(participant, previewContainer)
        })
      
        // When a Participant joins the Room, log the event.
        room.on('participantConnected', function(participant) {
          console.log("Joining: '" + participant.identity + "'")
        })
      
        // When a Participant adds a Track, attach it to the DOM.
        room.on('trackAdded', function(track, participant) {
          console.log(participant.identity + " added track: " + track.kind)
          let previewContainer = document.getElementById('remote-media')
          console.log(tracks, previewContainer)
          attachTracks([track], previewContainer)
        });
      
        // When a Participant removes a Track, detach it from the DOM.
        room.on('trackRemoved', function(track, participant) {
          console.log(participant.identity + " removed track: " + track.kind)
          detachTracks([track])
        })
      
        // When a Participant leaves the Room, detach its Tracks.
        room.on('participantDisconnected', function(participant) {
          console.log("Participant '" + participant.identity + "' left the room")
          detachParticipantTracks(participant);
        });
      
        // Once the LocalParticipant leaves the room, detach the Tracks
        // of all Participants, including that of the LocalParticipant.
        room.on('disconnected', function() {
          console.log('Left')
          if (previewTracks) {
            previewTracks.forEach(function(track) {
              track.stop()
            })
            previewTracks = null
          }
          detachParticipantTracks(room.localParticipant)
          room.participants.forEach(detachParticipantTracks)
          activeRoom = null
          document.getElementById('button-join').style.display = 'inline'
          document.getElementById('button-leave').style.display = 'none'
        });
      }

    // Preview LocalParticipant's Tracks.
    document.getElementsByClassName('button-preview').onclick = function() {
        let localTracksPromise = previewTracks
        ? Promise.resolve(previewTracks)
        : Video.createLocalTracks()
    
        localTracksPromise.then(function(tracks) {
            window.previewTracks = previewTracks = tracks
            let previewContainer = document.getElementById('local-media')
            if (!previewContainer.querySelector('video')) {
                attachTracks(tracks, previewContainer)
                console.log(tracks, previewContainer)
            }
        }, function(error) {
            console.error('Unable to access local media', error)
            console.log('Unable to access Camera and Microphone')
        })
    };  

    // Leave Room.
    function leaveRoomIfJoined() {
        if (activeRoom) {
        activeRoom.disconnect();
        }
    }

    return (
        <div>
            video room
            <div id="remote-media"></div>
                <div id="controls">
                <div id="preview">
                    <div id="local-media"></div>
                </div>
                <div id="room-controls">
                    <button id="button-join">Join Room</button>
                    <button id="button-leave">Leave Room</button>
                </div>
                <div id="log"></div>
            </div>
        </div>
    )
}
