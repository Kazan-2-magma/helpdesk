import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface AccordionItem {
  title: string;
  content: string;
  open: boolean;
}

@Component({
  selector: 'app-accordion',
  imports: [
    CommonModule,
  ],
  
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {
  items: AccordionItem[] = [
    {
      title: 'What is Flowbite?',
      content: `
        <p class="mb-2 text-gray-500 dark:text-gray-400">
          Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          Check out this guide to learn how to <a href="/docs/getting-started/introduction/" class="text-blue-600 dark:text-blue-500 hover:underline">get started</a> and start developing websites even faster with components on top of Tailwind CSS.
        </p>
      `,
      open: true,
    },
    {
      title: 'Is there a Figma file available?',
      content: `
        <p class="mb-2 text-gray-500 dark:text-gray-400">
          Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          Check out the <a href="https://flowbite.com/figma/" class="text-blue-600 dark:text-blue-500 hover:underline">Figma design system</a>.
        </p>
      `,
      open: false,
    },
    {
      title: 'What are the differences between Flowbite and Tailwind UI?',
      content: `
        <p class="mb-2 text-gray-500 dark:text-gray-400">
          The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product.
        </p>
        <p class="mb-2 text-gray-500 dark:text-gray-400">
          Flowbite relies on smaller standalone components, Tailwind UI offers full sections of pages.
        </p>
      `,
      open: false,
    },
  ];

  toggle(index: number) {
    this.items[index].open = !this.items[index].open;
  }
}
