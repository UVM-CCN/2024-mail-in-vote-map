# import pandas
import pandas as pd

day = "10"

# read the csv file (sometimes we need the encoding parameter)
# df = pd.read_csv('external-data/DetailedAbsenteeVotersList_10.24.2024.csv', encoding="ISO-8859-1")
df = pd.read_csv('external-data/DetailedAbsenteeVotersList_10.30.2024.csv')

print(df.head())

# create new dataframe that only keeps columns "Voter ID", "Ballot Status", "Town Name" and "County"
df = df[["Voter ID", "Ballot Status", "Town Name", "County"]]

# for each "Town Name" count the number of "Ballot Status" equal to "RECEIVED"
summary_df = df[df["Ballot Status"] == "RECEIVED"].groupby("Town Name").count()

# also count the number of "Ballot Status" equal to "ISSUED"
summary_df = summary_df.join(df[df["Ballot Status"] == "ISSUED"].groupby("Town Name").count(), how="outer", rsuffix=" ISSUED")

summary_df = summary_df[["County ISSUED", "Ballot Status"]]

# rename "Ballot Status" into "Number of Ballots Received"
summary_df.rename(columns={"Ballot Status": "Number of Ballots Received"}, inplace=True)
summary_df.rename(columns={"County ISSUED": "Number of Ballots Issued"}, inplace=True)

# save the new dataframe to a new csv file
df.to_csv('external-data/filtered-20241030.csv', index=False)

#summary_df.to_csv('external-data/summary-20241014.csv', index=True)

