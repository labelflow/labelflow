import torch.utils.data as data


class CombineDBs(data.Dataset):
    def __init__(self, dataloaders, excluded=None):
        self.dataloaders = dataloaders
        self.excluded = excluded
        self.im_ids = []

        # Combine object lists
        for dl in dataloaders:
            for elem in dl.im_ids:
                if elem not in self.im_ids:
                    self.im_ids.append(elem)

        # Exclude
        if excluded:
            for dl in excluded:
                for elem in dl.im_ids:
                    if elem in self.im_ids:
                        self.im_ids.remove(elem)

        # Get object pointers
        self.obj_list = []
        self.im_list = []
        new_im_ids = []
        obj_counter = 0
        num_images = 0
        for ii, dl in enumerate(dataloaders):
            for jj, curr_im_id in enumerate(dl.im_ids):
                if (curr_im_id in self.im_ids) and (curr_im_id not in new_im_ids):
                    flag = False
                    new_im_ids.append(curr_im_id)
                    for kk in range(len(dl.obj_dict[curr_im_id])):
                        if dl.obj_dict[curr_im_id][kk] != -1:
                            self.obj_list.append({'db_ii': ii, 'obj_ii': dl.obj_list.index([jj, kk])})
                            flag = True
                        obj_counter += 1
                    self.im_list.append({'db_ii': ii, 'im_ii': jj})
                    if flag:
                        num_images += 1

        self.im_ids = new_im_ids
        print('Combined number of images: {:d}\nCombined number of objects: {:d}'.format(num_images, len(self.obj_list)))

    def __getitem__(self, index):

        _db_ii = self.obj_list[index]["db_ii"]
        _obj_ii = self.obj_list[index]['obj_ii']
        sample = self.dataloaders[_db_ii].__getitem__(_obj_ii)

        if 'meta' in sample.keys():
            sample['meta']['db'] = str(self.dataloaders[_db_ii])

        return sample

    def __len__(self):
        return len(self.obj_list)

    def __str__(self):
        include_db = [str(db) for db in self.dataloaders]
        exclude_db = [str(db) for db in self.excluded]
        return 'Included datasets:'+str(include_db)+'\n'+'Excluded datasets:'+str(exclude_db)
