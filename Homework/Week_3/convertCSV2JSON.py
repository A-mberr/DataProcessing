# Name: Amber Nobel
# Student number: 11819359

import matplotlib
import pandas as pd
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import json

# reads csv and converts it to a dataframe
df = pd.read_csv('KNMI_temp.csv', delimiter=';')

# creates json with the country as index
data = df.set_index('year').to_json(orient='index')
print(data)

# saves the KNMI_temp as a json file
with open('data.json', 'w') as outfile:
    outfile.write(data)
