import sys
import json

from commands.command_parser import parse_command

print("Testing exact user phrases...")
res1 = parse_command("open pw phyics videos")
res2 = parse_command("open pw phyics lectures")

with open("test_output2.json", "w") as f:
    json.dump({"test1": res1, "test2": res2}, f, indent=2)
print("Done")
