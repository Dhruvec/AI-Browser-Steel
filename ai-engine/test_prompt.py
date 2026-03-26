import sys
import json

from commands.command_parser import parse_command

print("Testing AI Intent Parser...")
res = parse_command("open PW physics videos on youtube")
with open("test_output.json", "w") as f:
    json.dump(res, f, indent=2)
print("Done")
