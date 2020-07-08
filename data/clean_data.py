'''
By: Vasco Madrid
Description:
	Reads json files created by sql script and 
	creates json file better fit for d3 javascript graphing
'''

import json

with open("keys_by_decade.json") as f:
    data = json.load(f)
    clean_data = []
    for row in data:
        print(row)
