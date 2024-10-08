# import pandas
import pandas as pd

# read the csv file
df = pd.read_csv('external-data/DetailedAbsenteeVotersList_10.7.2024.csv')

# create new dataframe that only keeps columns "Voter ID", "Ballot Status", "Town Name" and "County"
df = df[["Voter ID", "Ballot Status", "Town Name", "County"]]

# save the new dataframe to a new csv file
df.to_csv('external-data/filtered-20241007.csv', index=False)

