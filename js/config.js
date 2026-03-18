const siteConfig = {
  university: {
    shortName: "МГТУ им. Носова",
    fullName: "Магнитогорский государственный технический университет",
    yearTitle: "ЗАСЕЛЕНИЕ 2026",
    logo: "assets/logo.png"
  },
  chatLinks: {
    secondCourse: "https://t.me/example_second_course",
    thirdFourthCourse: "https://t.me/example_third_fourth"
  },
  downloads: {
    secondCourse: {
      // Локальные файлы для 2 курса: просто положите PDF в эти пути внутри проекта.
      contractFilePath: "docs/contracts/dogovor.pdf",
      contractFileName: "dogovor-mgtu-2-kurs.pdf",
      contractSamplePath: "docs/examples/primer-dogovora.pdf",
      contractSampleFileName: "primer-zapolneniya-dogovora.pdf"
      // Внешняя ссылка (если когда-то понадобится):
      // contractExternalUrl: "https://example.com/dogovor.pdf"
    },
    thirdFourthCourse: {
      // Для 3-4 курса вкладка "Договор" скрыта по вашей логике.
      // Если позже понадобятся кнопки скачивания, заполните поля ниже.
      // exampleFilePath: "docs/some-file.pdf",
      // exampleFileName: "some-file.pdf"
    }
  },
  data: {
    accountsUrl: "data/accounts.json"
  }
};
