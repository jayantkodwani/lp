document.addEventListener('DOMContentLoaded', () => { 
    // Complementary angles logic
    const complementaryDropArea = document.getElementById('complementaryDropArea');
    const complementaryFeedback = document.getElementById('complementaryFeedback');
    let selectedComplementaryAngles = [];

    // Supplementary angles logic
    const supplementaryDropArea = document.getElementById('supplementaryDropArea');
    const supplementaryFeedback = document.getElementById('supplementaryFeedback');
    let selectedSupplementaryAngles = [];

    let correctComplementary = 0;
    let correctSupplementary = 0;
    let totalAttempts = 0;

    // Function to handle the 5-minute timer
    let timerDuration = 5 * 60; // 5 minutes in seconds
    let timerInterval = setInterval(() => {
        const minutes = Math.floor(timerDuration / 60);
        const seconds = timerDuration % 60;
        document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timerDuration === 0) {
            clearInterval(timerInterval);
            alert("Time is up! Please submit your answers.");
            handleSubmit();
        }
        timerDuration--;
    }, 1000);

    // Function to draw angles visually on canvas (draggable)
    function drawAngleOnCanvas(canvasId, degrees) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const radius = 40;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear any previous drawing
        ctx.strokeStyle = "black"; // Set stroke color to black
        ctx.lineWidth = 2; // Set line width for better visibility

        ctx.beginPath();
        ctx.moveTo(50, 50); // Starting point of the angle
        ctx.arc(50, 50, radius, 0, degrees * Math.PI / 180); // Draw the angle arc
        ctx.lineTo(50, 50); // Return back to the center
        ctx.stroke(); // Apply the stroke to make the arc visible

        ctx.font = '14px Arial'; // Set font for the angle label
        ctx.fillStyle = 'black'; // Set text color to black
        ctx.fillText(`${degrees}°`, 70, 50); // Display the angle value
    }

    // Draw the draggable complementary angles
    drawAngleOnCanvas('complementary-30', 30);
    drawAngleOnCanvas('complementary-60', 60);
    drawAngleOnCanvas('complementary-40', 40);
    drawAngleOnCanvas('complementary-70', 70);
    drawAngleOnCanvas('complementary-10', 10);
    drawAngleOnCanvas('complementary-100', 100);

    // Draw the draggable supplementary angles
    drawAngleOnCanvas('supplementary-110', 110);
    drawAngleOnCanvas('supplementary-70', 70);
    drawAngleOnCanvas('supplementary-120', 120);
    drawAngleOnCanvas('supplementary-50', 50);
    drawAngleOnCanvas('supplementary-15', 15);
    drawAngleOnCanvas('supplementary-25', 25);

    // Drag-and-drop logic for both sections
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.dataset.value);
        });
    });

    complementaryDropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    complementaryDropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        const angleValue = event.dataTransfer.getData('text/plain');
        selectedComplementaryAngles.push(parseInt(angleValue));
        updateDropAreaWithAngle(complementaryDropArea, selectedComplementaryAngles, 'complementary');
    });

    supplementaryDropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    supplementaryDropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        const angleValue = event.dataTransfer.getData('text/plain');
        selectedSupplementaryAngles.push(parseInt(angleValue));
        updateDropAreaWithAngle(supplementaryDropArea, selectedSupplementaryAngles, 'supplementary');
    });

    function updateDropAreaWithAngle(dropArea, selectedAngles, type) {
        const totalAngle = selectedAngles.reduce((acc, angle) => acc + angle, 0);
        const ctx = prepareCanvasInDropArea(dropArea);

        selectedAngles.forEach((angle, index) => {
            // Draw each angle, rotating based on the previous angle sum
            const rotationAngle = index === 0 ? 0 : selectedAngles.slice(0, index).reduce((acc, angle) => acc + angle, 0);
            drawRotatedAngle(ctx, rotationAngle, angle, index + 1);
        });

        // Check after two angles are selected
        if (selectedAngles.length === 2) {
            totalAttempts++;
            if (type === 'complementary') {
                if (totalAngle === 90) {
                    correctComplementary++;
                }
            } else if (type === 'supplementary') {
                if (totalAngle === 180) {
                    correctSupplementary++;
                }
            }
        }

        // Provide feedback on the sum
        let feedbackText = `Total angle: ${totalAngle}°. `;
        if (type === 'complementary') {
            feedbackText += (totalAngle === 90) ? "Correct! The angles form a complementary pair." : "Incorrect. The angles don't sum up to 90°.";
        } else if (type === 'supplementary') {
            feedbackText += (totalAngle === 180) ? "Correct! The angles form a supplementary pair." : "Incorrect. The angles don't sum up to 180°.";
        }

        if (type === 'complementary') {
            complementaryFeedback.textContent = feedbackText;
        } else {
            supplementaryFeedback.textContent = feedbackText;
        }
    }

    // Function to prepare the canvas inside the drop area
    function prepareCanvasInDropArea(dropArea) {
        dropArea.textContent = ''; // Clear previous content

        // Create a canvas for the combined angles
        const canvas = document.createElement('canvas');
        canvas.width = 400; // Increased width for better visibility
        canvas.height = 400; // Increased height for better visibility
        dropArea.appendChild(canvas);
        return canvas.getContext('2d');
    }

    // Function to draw a rotated angle on the canvas with its measurement
    function drawRotatedAngle(ctx, rotationAngle, angle, index) {
        ctx.save();
        ctx.translate(200, 200); // Move to the center of the canvas
        ctx.rotate(rotationAngle * Math.PI / 180); // Rotate the context by the sum of the previous angles
        ctx.beginPath();
        ctx.moveTo(0, 0); // Start from the center
        ctx.arc(0, 0, 100, 0, angle * Math.PI / 180); // Draw the angle arc with appropriate radius
        ctx.lineTo(0, 0); // Draw back to the center
        ctx.strokeStyle = 'black'; // Set stroke color to black
        ctx.lineWidth = 2; // Set line width for better visibility
        ctx.stroke(); // Render the angle

        // Display the angle measurement
        ctx.font = '16px Arial'; // Increased font size for better visibility
        ctx.fillStyle = 'black'; // Set text color to black
        ctx.fillText(`${angle}°`, 120, -30 * index); // Adjust text position to avoid cutting off
        ctx.restore();
    }

    // Reset functionality for complementary question
    document.getElementById('resetComplementaryButton').addEventListener('click', () => {
        selectedComplementaryAngles = [];
        complementaryFeedback.textContent = '';
        complementaryDropArea.textContent = 'Drop angles here';
    });

    // Reset functionality for supplementary question
    document.getElementById('resetSupplementaryButton').addEventListener('click', () => {
        selectedSupplementaryAngles = [];
        supplementaryFeedback.textContent = '';
        supplementaryDropArea.textContent = 'Drop angles here';
    });

    // Handle form submission
    document.getElementById('submitButton').addEventListener('click', handleSubmit);

    function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const studentName = document.getElementById('studentName').value.trim();
        if (!studentName) {
            document.getElementById('nameError').textContent = 'Please enter your name.';
            return;
        }
        document.getElementById('nameError').textContent = ''; // Clear error

        clearInterval(timerInterval); // Stop the timer

        // Set hidden fields with correct answers and total attempts
        document.getElementById('correctComplementary').value = correctComplementary;
        document.getElementById('correctSupplementary').value = correctSupplementary;
        document.getElementById('totalAttempts').value = totalAttempts;

        // Submit the form
        document.querySelector('form').submit();
    }

    
});
