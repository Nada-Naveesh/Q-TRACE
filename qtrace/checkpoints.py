import os
import json
from typing import Dict, Any, Optional
from qtrace.utils import save_json, load_json

class CheckpointManager:
    """Manages experiment state checkpointing and resuming under results/checkpoints/."""

    def __init__(self, checkpoint_dir: str = "results/checkpoints"):
        self.checkpoint_dir = checkpoint_dir
        os.makedirs(self.checkpoint_dir, exist_ok=True)
        self.state_file = os.path.join(self.checkpoint_dir, "experiment_state.json")

    def save_stage(self, stage_name: str, stage_data: Dict[str, Any]):
        """Save completed stage results to checkpoint directory."""
        stage_file = os.path.join(self.checkpoint_dir, f"stage_{stage_name}.json")
        save_json(stage_data, stage_file)

        # Update master state
        master_state = load_json(self.state_file) or {"completed_stages": []}
        if stage_name not in master_state["completed_stages"]:
            master_state["completed_stages"].append(stage_name)
        master_state["last_completed"] = stage_name
        save_json(master_state, self.state_file)

    def load_stage(self, stage_name: str) -> Optional[Dict[str, Any]]:
        """Load stage results if previously completed."""
        stage_file = os.path.join(self.checkpoint_dir, f"stage_{stage_name}.json")
        return load_json(stage_file)

    def is_stage_completed(self, stage_name: str) -> bool:
        """Check whether specific stage was completed."""
        master_state = load_json(self.state_file)
        if not master_state:
            return False
        return stage_name in master_state.get("completed_stages", [])
