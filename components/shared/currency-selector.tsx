'use client'

import useSettingStore from '@/hooks/use-setting-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Globe } from 'lucide-react'

export default function CurrencySelector() {
  const { setting, setCurrency } = useSettingStore()
  const currentCurrency = setting.currency

  const handleCurrencyChange = async (currencyCode: string) => {
    await setCurrency(currencyCode)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {setting.availableCurrencies.find((c) => c.code === currentCurrency)
              ?.symbol || currentCurrency}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {setting.availableCurrencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className={`cursor-pointer ${
              currentCurrency === currency.code ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{currency.symbol}</span>
              <span className="text-sm text-muted-foreground">
                {currency.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
