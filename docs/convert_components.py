import os
import glob
from m2r import parse_from_file

fileNames = glob.glob("components/*.md")

for fileName in fileNames:
    file = open(fileName.replace(".md", ".rst"),"w+")
    file.write(parse_from_file(fileName))
    file.close()
    os.remove(fileName)


