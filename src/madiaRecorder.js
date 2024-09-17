/* https://github.com/mdn/dom-examples/tree/main/media/web-dictaphone */

if (navigator.mediaDevices) {
    console.log("getUserMedia supported.");
  
    const constraints = { audio: true };
    let chunks = [];
  
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
  
        record.onclick = () => {
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          console.log("recorder started");
        };
  
        stopRecording.onclick = () => {
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          console.log("recorder stopped");
        };
  
        mediaRecorder.onstop = (e) => {
          console.log("data available after MediaRecorder.stop() called.");
  
        //   const clipName = prompt("Enter a name for your sound clip");
  
          const clipContainer = document.createElement("article");
          const audio = document.createElement("audio");
          const deleteButton = document.createElement("button");
          const mediaContainer = document.querySelector("#mediaContainer");
  
          clipContainer.classList.add("d-flex");
          audio.setAttribute("controls", "");
          audio.classList.add("container-fluid", "px-0");
          deleteButton.textContent = "Delete";
          deleteButton.classList.add("btn", "btn-danger", "ms-3");
  
          clipContainer.appendChild(audio);
          clipContainer.appendChild(deleteButton);
          mediaContainer.appendChild(clipContainer);
  
          audio.controls = true;
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          chunks = [];
          const audioURL = URL.createObjectURL(blob);
          audio.src = audioURL;
          console.log("recorder stopped");
  
          deleteButton.onclick = (e) => {
            const evtTgt = e.target;
            evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
          };
        };
  
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
      })
      .catch((err) => {
        console.error(`The following error occurred: ${err}`);
      });
  }
  