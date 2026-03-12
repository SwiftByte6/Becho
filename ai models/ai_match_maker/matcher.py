from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

# recycler data
recyclers = [
 {"name":"EcoPlast","material":"plastic","location":"mumbai","capacity":500,"price":12},
 {"name":"MetalWorks","material":"metal","location":"pune","capacity":300,"price":20},
 {"name":"PaperCycle","material":"paper","location":"mumbai","capacity":400,"price":8},
 {"name":"GlassLoop","material":"glass","location":"thane","capacity":350,"price":10}
]

def find_best_match(material, location, quantity):

    best_match = None
    best_score = 0

    for r in recyclers:

        score = 0

        # material match
        if r["material"] == material:
            score += 50

        # location match
        if r["location"] == location:
            score += 30

        # capacity match
        if quantity <= r["capacity"]:
            score += 20

        # price bonus
        score += r["price"]

        if score > best_score:
            best_score = score
            best_match = r

    return best_match, best_score

print("Testing AI Match Maker...")
match, score = find_best_match("plastic","mumbai",200)

print("Best recycler:", match)
print("Match score:", score)