import json
import os

stations_dir = 'public/data/stations'

# Get all JSON files except index.json
for filename in os.listdir(stations_dir):
    if filename.endswith('.json') and filename != 'index.json':
        filepath = os.path.join(stations_dir, filename)
        
        # Read the JSON file
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        # Update stationName to include call letters
        call_letters = data.get('callLetters', '')
        station_name = data.get('stationName', '')
        
        # Only update if they're different (avoid "KRVB - KRVB")
        if call_letters and station_name and call_letters not in station_name:
            data['stationName'] = f"{call_letters} - {station_name}"
            print(f"Updated {filename}: {data['stationName']}")
        elif call_letters and not station_name:
            data['stationName'] = call_letters
            print(f"Set {filename}: {data['stationName']}")
        else:
            print(f"Skipped {filename}: Already has call letters or no data")
        
        # Write back to file
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)

print("\nAll station names updated!")