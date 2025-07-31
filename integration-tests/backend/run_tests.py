import os
import sys
from behave import configuration, runner, parser
from behave.__main__ import main as behave_main

def run_feature(feature_path):
    # Set up absolute paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    features_dir = os.path.join(base_dir, 'features')
    steps_dir = os.path.join(features_dir, 'step_definitions')
    support_dir = os.path.join(features_dir, 'support')
    
    # Configure behave
    config = configuration.Configuration()
    config.setup_logging()
    config.paths = [features_dir]
    config.steps_dir = steps_dir
    config.environment_file = os.path.join(support_dir, 'environment.py')
    
    # Add feature path to config
    config.paths = [feature_path]
    
    # Run behave normally
    runner.Runner(config).run()

if __name__ == '__main__':
    feature_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'features',
        'form_api.feature'
    )
    run_feature(feature_path)
