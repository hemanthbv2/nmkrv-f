import urllib.request
import re

url = "https://www.pexels.com/search/college%20students/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'https://images.pexels.com/photos/\d+/pexels-photo-\d+\.jpeg', html)
    # Get unique images
    images = list(set(images))
    for i in range(min(10, len(images))):
        print(images[i])
except Exception as e:
    print('Failed:', e)
