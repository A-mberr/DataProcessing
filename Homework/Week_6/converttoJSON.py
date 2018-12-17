# Name: Amber Nobel
# Student number: 11819359

import pandas as pd

# reads csv and converts it to a dataframe
df = pd.read_csv('cereal.csv', delimiter=';')

df = df[['name', 'calories', 'fat', 'protein', 'carbo']]

# creates json to use it for d3 visualisation
data = df.to_json('data.json', orient='records')
