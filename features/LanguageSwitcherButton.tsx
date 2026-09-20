import { Button } from '@heroui/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export const LanguageSwitcherButton = () => {
    const pathname = usePathname();
    const router = useRouter();

    const switchLocale = (locale: string) => {
        const segments = pathname.split('/');
        segments[1] = locale;
        router.push(segments.join('/'));
    };

    const currentLocale = pathname.split('/')[1];

    return (
        <div className="flex gap-2">
            <Button
                isIconOnly
                onClick={() => switchLocale('ru')}
                className="w-8 h-8"
                variant={currentLocale === 'ru' ? 'primary' : 'secondary'}
            >
                <Image
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE50lEQVR4nO3ZW0xTZwAH8EYZWzYzb5sbE8dF7nIrLVDAUi4KorBkGrJlWWL2suxlc2/Lsk3cFEVlKrrFuenmlm0wnDoZQ5lKlYqWi5RyK/ROb6fnnJa2CKUC9r/gkoWXpdRSeh74J+fxJL//Od/5vnO+w2ItZSlL8TkAlqkIe4Zcb/lwWEfXy0bonkEtqR/QkM5+FeHsU5n0UoWxp0dhqJfK9Xu6h3Tps+ewAh2FwbpBabJXKIw2rdxgxbDegiEdDdkIhUEtiQE1gT6VCb1KI6QKA3rkekiGdeiWadE5oNZ09Kv3iqXy0EWHa2y2VSqzo0pF2FxKkw3e4rsGNbMF0NGvgrhPOSWWymuEEs2qRcFrybFdarOdUhF2+Ipv71NCLJXjXs8w2iQySnR/cKff4EIgSPP4qtvdC48fwp1uGUT3B3G7s+9MV1fXUwuK7+9HsNo81qg2O+BPfGtnP2539EEo7m1YsBIAlmtIR91i4W+196JFLMXNez2XhEJhkM8FNOaxkwHA48ZdCa7fuX/CNzzlKPH3mG/9fzyaWzvdzaKOsifCGwyOtWqznQ4U/m9R12wBXL3VTjWKRKu9LqAy248EHH+7A0232vHXzbtVXuG11HiIkrBPMALfcg+NN9qcTULx/Ffsj9pcoqLGR9j65wwKG2ZQcGUa+ZenkHdpCrkXH4L/uwubL7iQXT+JrN+c4NU5kVE7gfRfx8H9ZRxpPz8A+6cxpP44huTzDiT9YEfi93ZsOmdD/NlRxH1nRey3VkSfsSDqGxobT9OI+JpC+Fckwk6R2HDSjNAaAutPEAg5bsLLx4zYflbeOi+8UIig8uapGSbhX/rSiOga7bSgAp6n1aqOyXeYhl9XbcALR/V483zv2x4LfCxyNjMRv/aIHsWnB5s8FnivxWVgIn5NlQ68k0M6jwXeuOZyMRG/6tAIYqoVkx4LbG+YdDMRv/LgCF45rHrksUDh5YeMxD9fqcXqSjU8Fii45GIkfsUBDVYemEeB4ssTbibin9uvwbpKhechtPPKuIuJ+Ge/UCP8kMzzQ7z76gM9E/HPfK5CytFez9Po+9dt15iIf3qfCvxjEs8L2Sctlt1MxAdXKFF6qv0tjwUqhAjacsExwzT8i/tl04KKeX4jv9toETEJH7RXAV519/xep2czzn89xJb32oQtvwy2vDLYBKWwCXZgNHcHRvnbMbq5BNacbbBmb4M1qxhWXhEsmVthydwCS0Yh6PRC0NwC0Jx80Gl5oNgCUKm5oFJyQSbzQSZtBpmYA3JTNswJWf8e8TwQcZkgYjNAxKSDiObCFMWFaSMHpki2Uxeasp7lTUbzSw8zA58GQzj7IMvb2IuK1owKSikG4MmRV5O8/6ifjTW3pMSau8MdMHwE222ISH6ybZX/SvBLagKBN0awYQhPPc7yNSgvX27JKa4NAP4iBALftxYfl0goD7ZkFTcsGj4s5Y8uDmdhd6gf34mMrVV05ha3X8d8WErNguPnxpJZuItOL6D8MNtQprBk//3gmBsyQbCC5uTvo9MELl/xxgj2lCGCXaMJS1mcX0xzY0kShFKp/M+oZL7GW7wxMk1timR/6vUK64+AxVpGJ2ZzzZty9pAJWXVEPE9ijs/SmeN4E0Rs5gQRm6EjYrgSUxSn1hjN+cAUyebOnsNaylKWwvI1/wAaAzsOClodygAAAABJRU5ErkJggg=="
                    alt="russian-federation-circular"
                    width={30}
                    height={30}
                />
            </Button>
            <Button
                isIconOnly
                onClick={() => switchLocale('en')}
                className="w-8 h-8"
                variant={currentLocale === 'ru' ? 'secondary' : 'primary'}
            >
                <Image
                    src="data:image/png;base64,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"
                    alt="great-britain-circular"
                    width={30}
                    height={30}
                />
            </Button>
        </div>
    );
};
