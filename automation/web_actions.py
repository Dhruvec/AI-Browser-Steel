class WebActions:

    def __init__(self, page):
        self.page = page

    def click(self, selector):
        self.page.click(selector)

    def type_text(self, selector, text):
        self.page.fill(selector, text)

    def press_key(self, key):
        self.page.keyboard.press(key)

    def scroll(self, pixels):
        self.page.mouse.wheel(0, pixels)

    def get_text(self, selector):
        return self.page.inner_text(selector)