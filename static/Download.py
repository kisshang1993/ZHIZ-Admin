import os
from subprocess import Popen, PIPE

save_path = 'backup'
file = open('path.txt')
dir = ''
for line in file:
    line = line.replace('\n', '')
    if line.find('#') == 0:
        id = line[1:]
        dir = os.path.join(save_path, id)
        if not os.path.exists(dir):
            os.mkdir(dir)
            print('Mkdir ==> %s' % dir)

    elif dir != '':
        img_name = line.rsplit('/')[-1]
        save_name = os.path.join(dir, img_name)
        if not os.path.exists(save_name):
            cmd = 'curl %s > %s' % (line, save_name)
            pro = Popen(cmd, shell=True, stdout=PIPE, stderr=PIPE) 
            print('Download ==> %s' % save_name)
        else:
            print('Skip %s' % save_name)


file.close()