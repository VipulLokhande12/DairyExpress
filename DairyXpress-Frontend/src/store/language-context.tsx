import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AppLanguage = 'en' | 'mr';

const exact: Record<string, string> = {
  Home: 'मुख्यपृष्ठ', Shop: 'दुकान', Subscriptions: 'सदस्यता', About: 'आमच्याबद्दल', Admin: 'प्रशासक', Search: 'शोधा',
  'My Dashboard': 'माझे डॅशबोर्ड', 'My Orders': 'माझ्या ऑर्डर्स', Addresses: 'पत्ते', 'Sign out': 'साइन आउट', Categories: 'श्रेणी',
  'Fresh milk, on repeat': 'ताजे दूध, नियमितपणे', Plans: 'योजना', 'Choose your milk plan': 'तुमची दूध योजना निवडा',
  'Flexible subscriptions that save you money. Cancel or pause anytime — no lock-in.': 'पैसे वाचवणारी लवचिक सदस्यता. कधीही थांबवा किंवा रद्द करा.',
  'Your active subscriptions': 'तुमच्या सक्रिय सदस्यता', Daily: 'दैनिक', Weekly: 'साप्ताहिक', Monthly: 'मासिक',
  'Most popular': 'सर्वाधिक लोकप्रिय', 'Start subscription': 'सदस्यता सुरू करा', 'Pause subscription': 'सदस्यता थांबवा', 'Resume subscription': 'सदस्यता पुन्हा सुरू करा',
  Questions: 'प्रश्न', 'All fresh products': 'सर्व ताजी उत्पादने', 'Shop all': 'सर्व खरेदी करा', Filters: 'फिल्टर', 'Apply filters': 'फिल्टर लागू करा',
  'Clear filters': 'फिल्टर साफ करा', Refine: 'परिष्कृत करा', Price: 'किंमत', 'Organic only': 'फक्त सेंद्रिय', Delivery: 'वितरण',
  'No products found': 'उत्पादने सापडली नाहीत', 'Add to Cart': 'कार्टमध्ये जोडा', 'Customer reviews': 'ग्राहक पुनरावलोकने', 'Post review': 'पुनरावलोकन पोस्ट करा',
  'Write your product review': 'तुमचे उत्पादन पुनरावलोकन लिहा', 'In stock': 'स्टॉकमध्ये', 'Out of stock': 'स्टॉक संपला', 'Product not found': 'उत्पादन सापडले नाही',
  Cart: 'कार्ट', Checkout: 'चेकआउट', 'Order summary': 'ऑर्डर सारांश', 'Place order': 'ऑर्डर द्या', 'Delivery address': 'वितरण पत्ता',
  Dashboard: 'डॅशबोर्ड', Orders: 'ऑर्डर्स', Wishlist: 'इच्छा सूची', Rewards: 'बक्षिसे', Settings: 'सेटिंग्ज', 'Account settings': 'खाते सेटिंग्ज',
  Name: 'नाव', Email: 'ईमेल', Phone: 'फोन', 'Save changes': 'बदल जतन करा', Cancel: 'रद्द करा', 'Track order': 'ऑर्डर ट्रॅक करा',
  'Order placed': 'ऑर्डर दिली', Confirmed: 'पुष्टी झाली', 'Preparing fresh': 'तयार करत आहे', Packed: 'पॅक झाले', 'Out for delivery': 'वितरणासाठी बाहेर', Delivered: 'वितरित झाले',
  'About DairyXpress': 'DairyXpress बद्दल', 'What the project does': 'प्रकल्प काय करतो', 'Explore products': 'उत्पादने पहा', 'View subscriptions': 'सदस्यता पहा',
  'Sign in': 'साइन इन', Customer: 'ग्राहक', Password: 'पासवर्ड', 'Email address': 'ईमेल पत्ता', 'Create account': 'खाते तयार करा', 'Register now': 'आता नोंदणी करा',
  'Ask Moo': 'मूला विचारा', Call: 'कॉल', Ticket: 'तिकीट', 'Live agent': 'प्रत्यक्ष प्रतिनिधी', 'Raise ticket': 'तिकीट नोंदवा',
  'Add product': 'उत्पादन जोडा', Product: 'उत्पादन', Stock: 'स्टॉक', Action: 'कृती', Healthy: 'योग्य', 'Selling price': 'विक्री किंमत',
  'Stay close to the farm': 'DairyXpress शी जोडलेले रहा', Subscribe: 'सदस्य व्हा', Support: 'मदत', 'Reach us': 'आमच्याशी संपर्क',
};

const phrases: Array<[string, string]> = [
  ['fresh dairy', 'ताजी दुग्ध उत्पादने'], ['milk', 'दूध'], ['paneer', 'पनीर'], ['cheese', 'चीज'], ['butter', 'लोणी'], ['ghee', 'तूप'], ['yogurt', 'दही'],
  ['products', 'उत्पादने'], ['product', 'उत्पादन'], ['delivery', 'वितरण'], ['order', 'ऑर्डर'], ['reviews', 'पुनरावलोकने'], ['review', 'पुनरावलोकन'],
  ['Save', 'बचत'], ['Free', 'मोफत'], ['Fresh', 'ताजे'], ['Popular', 'लोकप्रिय'], ['Organic', 'सेंद्रिय'], ['Search', 'शोधा'], ['Support', 'मदत'],
];

const LanguageContext = createContext<{ language: AppLanguage; setLanguage: (language: AppLanguage) => void }>({ language: 'en', setLanguage: () => undefined });
const originals = new WeakMap<Node, string>();
const originalAttributes = new WeakMap<Element, Record<string, string>>();

function marathi(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return text;
  let translated = exact[trimmed] ?? trimmed;
  if (translated === trimmed) for (const [from, to] of phrases) translated = translated.replace(new RegExp(`\\b${from}\\b`, 'gi'), to);
  return text.replace(trimmed, translated);
}

function translateTree(root: Node, language: AppLanguage) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = root.nodeType === Node.TEXT_NODE ? [root as Text] : [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => {
    if (['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName ?? '')) return;
    if (!originals.has(node)) originals.set(node, node.nodeValue ?? '');
    const source = originals.get(node) ?? '';
    node.nodeValue = language === 'mr' ? marathi(source) : source;
  });
  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll('*'))] : root instanceof Document ? Array.from(document.querySelectorAll('*')) : [];
  elements.forEach((element) => {
    const attrs = ['placeholder', 'aria-label', 'title'];
    if (!originalAttributes.has(element)) originalAttributes.set(element, Object.fromEntries(attrs.map((name) => [name, element.getAttribute(name) ?? ''])));
    const source = originalAttributes.get(element)!;
    attrs.forEach((name) => { if (source[name]) element.setAttribute(name, language === 'mr' ? marathi(source[name]) : source[name]); });
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => localStorage.getItem('dv_language') === 'mr' ? 'mr' : 'en');
  const setLanguage = (next: AppLanguage) => { localStorage.setItem('dv_language', next); setLanguageState(next); };
  useEffect(() => {
    document.documentElement.lang = language;
    let observer: MutationObserver;
    const run = (root: Node = document.body) => { observer?.disconnect(); translateTree(root, language); observer?.observe(document.body, { childList: true, subtree: true, characterData: true }); };
    observer = new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.type === 'characterData' ? run(mutation.target) : mutation.addedNodes.forEach((node) => run(node))));
    run();
    return () => observer.disconnect();
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}><div key={language}>{children}</div></LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
