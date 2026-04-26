"""
SD Pawsense — Server Entry Point
Run this file to start the Flask development server.

Usage:
    python app.py
"""
import sys
import os

# Add backend directory to Python path so imports work correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_server import create_app

app = create_app()

if __name__ == "__main__":
    print("=" * 50)
    print("  [SD Pawsense] AI Server")
    print("  URL: http://localhost:5000")
    print("  Endpoints:")
    print("     GET  /health          - Health check")
    print("     POST /predict-image   - CNN prediction")
    print("     POST /predict-symptoms - RNN (coming soon)")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=True)
