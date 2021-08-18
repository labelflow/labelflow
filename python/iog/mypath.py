class Path(object):
    @staticmethod
    def db_root_dir(database):
        if database == "pascal":
            return "data/VOCdevkit/VOC2012"  # folder that contains VOCdevkit/.

        elif database == "sbd":
            return "/path/to/SBD/"  # folder with img/, inst/, cls/, etc.
        else:
            print("Database {} not available.".format(database))
            raise NotImplementedError

    @staticmethod
    def models_dir():
        return "data/IOG_PASCAL_SBD_REFINEMENT.pth"
        #'resnet101-5d3b4d8f.pth' #resnet50-19c8e357.pth'
