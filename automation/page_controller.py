class PageController:

    def __init__(self, page):
        self.page = page

    def go_back(self):
        self.page.go_back()

    def go_forward(self):
        self.page.go_forward()

    def refresh(self):
        self.page.reload()

    def get_title(self):
        return self.page.title()

    def get_url(self):
        return self.page.url