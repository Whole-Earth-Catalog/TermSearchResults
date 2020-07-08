'''
By: Vasco Madrid
Description:
	Reads json files created by sql script and 
	creates json file better fit for d3 javascript graphing
'''

import json

clean_data = {}
with open("keys_by_decade.json") as f:
    data = json.load(f)
    # print(data)
    for elem in data:
	# format attributes
        term_key = elem['term_key']
	try:
            decade = int(elem['decade'])
	except ValueError as e:
            decade = 0
	count = int(elem['num_ids'])
	# only work with rows that have valid decade
	if decade > 0:
            datapoints = {'decade': decade, 'count': count}
            # check if key is in dict, and update list
            try:
                clean_data[term_key].append(datapoints)
	    except KeyError as e:
		clean_data.update({term_key: [datapoints]}) 
    #print(clean_data) 
def datapoints_to_str(datapoints):
	dp_str = "["
	for term_dict in datapoints:
	    dp_str = dp_str + "{\"decade\" : " + str(term_dict['decade']) + ", \"count\" : " + str(term_dict['count']) + "},"
	dp_str = dp_str[:len(dp_str)-1] + "]"
	return dp_str
# write clean data to json file
with open('clean_key_data.json', 'w') as f:
    f.write("{\n")
    for key in clean_data:
	f.write("{\"term_key\" : \"" + key + "\", \"datapoints\" : " + datapoints_to_str(clean_data[key]) + "},\n")
    f.write("}")
