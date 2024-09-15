from threading import Lock
from flask import Flask, render_template, request, redirect, url_for


app = Flask(__name__)

# Store results in memory (can later be moved to a database)
results_list = []
results_lock = Lock()

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/submit-results', methods=['POST'])
def submit_results():
    """Handle form submissions and store the results."""
    name = request.form['name']
    correct_complementary = request.form['correct_complementary']
    correct_supplementary = request.form['correct_supplementary']
    total_attempts = request.form['total_attempts']

    # Store the result in the list
    result = {
        'Name': name,
        'Correct Complementary': correct_complementary,
        'Correct Supplementary': correct_supplementary,
        'Total Attempts': total_attempts
    }
    
        # Use a lock to safely append results in a multi-threaded environment
    with results_lock:
        results_list.append(result)
 
    # Redirect to Thank You page after submission
    return redirect(url_for('thank_you'))

@app.route('/thank-you')
def thank_you():
    """Render the Thank You page."""
    return render_template('thankyou.html')

@app.route('/results')
def show_results():
    """Render the results page with the stored results."""
    return render_template('results.html', results=results_list)

if __name__ == '__main__':
    app.run(debug=True)
