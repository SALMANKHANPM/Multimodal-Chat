import os
import logging
from pathlib import Path
from transformers import AutoTokenizer, AutoModel

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def verify_model_exists(model_path: str) -> bool:
    """Verify if the model exists in the specified path"""
    logger.info(f"Verifying model at: {model_path}")

    # Check if base directory exists
    if not os.path.exists(model_path):
        logger.error(f"Model directory not found: {model_path}")
        return False

    # Check snapshots directory
    snapshots_dir = os.path.join(model_path, "snapshots")
    if not os.path.exists(snapshots_dir):
        logger.error(f"Snapshots directory not found: {snapshots_dir}")
        return False

    # List contents for debugging
    logger.info(f"Found directories: {os.listdir(model_path)}")
    logger.info(f"Found snapshots: {os.listdir(snapshots_dir)}")

    return True

def get_model_path() -> str:
    """Get the path to the model in HuggingFace cache"""
    model_path = os.path.join(str(Path.home()), '.cache', 'huggingface', 'hub', 'models--facebook--seamless-m4t-v2-large')
    logger.info(f"Model path: {model_path}")
    return model_path

def download_model():
    """Download the model if it doesn't exist"""
    try:
        logger.info("Downloading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained("facebook/seamless-m4t-v2-large")
        logger.info("Downloading model...")
        model = AutoModel.from_pretrained("facebook/seamless-m4t-v2-large")
        logger.info("Model downloaded successfully")
    except Exception as e:
        logger.error(f"Error downloading model: {str(e)}")
        raise

def setup():
    """Setup the model"""
    logger.info("Setting up the application... : Backend API")
    logger.info("Looking for Transformers model: Seamless-M4T-V2-Large")

    model_path = get_model_path()
    logger.info(f"Checking model path: {model_path}")

    if not os.path.exists(model_path) or not verify_model_exists(model_path):
        logger.info("Model not found. Downloading...")
        download_model()
    else:
        logger.info(f"Model found at: {model_path}")

if __name__ == "__main__":
    setup()