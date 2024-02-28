from flask import Flask, render_template

from sklearn.cluster import KMeans
from sklearn.manifold import MDS
from sklearn.preprocessing import StandardScaler
from scipy.spatial.distance import cdist, pdist
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

app = Flask(__name__)

def kmeans_clustering(data):
    kmeans = KMeans(n_clusters=2, init='k-means++')
    kmeans.fit(data)
    labels = kmeans.labels_
    return labels.tolist()

def compute_data_mds(data):
    embedding = MDS(n_components=2)
    return embedding.fit_transform(data)

def compute_variable_mds(data):
    embedding = MDS(n_components=2, dissimilarity='precomputed')
    dissimilarities = cdist(data, data, 'correlation')
    return embedding.fit_transform(dissimilarities)

@app.route('/')
def index():
    df = pd.read_csv('static/data/spotify_top_100.csv')

    features = [
        'Tempo',
        'Energy',
        'Danceability',
        'Intensity',
        'Live Likelihood',
        'Positiveness',
        'Duration',
        'Acoustic',
        'Speech Focus',
        'Popularity'
    ]

    df = df[features]
    scaled_df = pd.DataFrame(StandardScaler().fit_transform(df.values), index = df.index, columns = df.columns)
    scaled_df_T = scaled_df.transpose()
    
    data_mds = compute_data_mds(scaled_df)
    var_mds = compute_variable_mds(scaled_df_T)
    k_means_labels = kmeans_clustering(scaled_df)
    
    data = {'data_mds': data_mds.tolist(), 'var_mds': var_mds.tolist(), 'k_means_labels': k_means_labels}
    
    return render_template('index.html', data = data)
    
if __name__ == '__main__':
    app.run(debug=True, port = 8001)