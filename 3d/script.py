file = open("Wolf.obj")

lines = file.readlines()
file.close()
center = [0, 0, 0]
minv = [0, 0, 0]
maxv = [0, 0, 0]
nodes = []
triangles = []
quad = []
quint = []
for l in lines:
    t = l.split()
    if len(t) > 0:
        if t[0] == "v":
            t = [float(t[1]), float(t[2]), float(t[3])]
            minv = [min(minv[i], t[i]) for i in range(3)]
            maxv = [max(maxv[i], t[i]) for i in range(3)]

            nodes.append([t[0], t[1], t[2]])
        elif t[0] == "f":
            pts = [t[i].split('/')[0] for i in range(1, len(t))]
            if len(t) == 4:
                triangles.append(pts)
            elif len(t) == 5:
                quad.append(pts)
            elif len(t) == 6:
                quint.append(pts)

maxSize = max([maxv[i] - minv[i] for i in range(3)])
fact = 200 * 2 / maxSize
center = [(maxv[i] + minv[i]) / 2 for i in range(3)]
print("// Nodes")
for node in nodes:
    t = [(node[i] - center[i]) * fact for i in range(3)]
    print("parent.addNode({},{},{});".format(-t[2], t[0], t[1]))

print("// Triangles")
for poly in triangles:
    print("parent.addTriangle({},{},{},-1);".format(poly[0], poly[1], poly[2]))

print("// Quadrangles")
for poly in quad:
    print(
        "parent.addQuadrangle({},{},{},{},-1);".format(poly[0], poly[1], poly[2], poly[3]))

print("// Pentagones")
for poly in quint:
    print(
        "parent.addQuintangle({},{},{},{},{},-1);".format(poly[0], poly[1], poly[2], poly[3], poly[4]))
