import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useRouter } from "next/navigation";
import { z } from "zod"

const FILTERS = [
    {
        label: 'Types de prises:',
        key: 'prises',
        placeholder: 'prises',
        values: [
            { value: 'pinces', display: 'Pinces' },
            { value: 'bacs', display: 'Bacs' },
            { value: 'reglettes', display: 'Réglettes' },
            { value: 'boules', display: 'Boules' },
        ]
    },
    {
        label: 'Types de mouvements:',
        key: 'mouvements',
        placeholder: 'mouvements',
        values: [
            { value: 'statique', display: 'Statique' },
            { value: 'dynamique', display: 'Dynamique' }
        ]
    },
    {
        label: 'Niveau de difficulté:',
        key: 'difficulte',
        placeholder: 'difficultées',
        values: [
            { value: 'V5', display: 'V5' },
            { value: 'V4', display: 'V4' },
            { value: 'V3', display: 'V3' },
            { value: 'V2', display: 'V2' },
            { value: 'V1', display: 'V1' }
        ]
    }
]

export const FormSchema = z.object({
    prises: z.optional(z.string()),
    mouvements: z.optional(z.string()),
    difficulte: z.optional(z.string()),
})

export const pushRoute = (data) => {
    return `/bloc?${data.prises ? `prises=${data.prises}` : ''}
${data.mouvements ? `&prises=${data.mouvements}` : ''}
${data.difficulte ? `&prises=${data.difficulte}` : ''}`
}

export default function PostFilters({ form }) {

    return (
        <>
            {FILTERS.map((filter) => (
                <FormField
                    key={filter.key}
                    control={form.control}
                    name={filter.key}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{filter.label}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={filter.placeholder} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filter.values.map((filter) => (
                                        <SelectItem key={filter.value} value={filter.value}>{filter.display}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* <FormDescription>
                    You can manage email addresses in your{" "}
                    <Link href="/examples/forms">email settings</Link>. 
                  </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))
            }
        </>
    )
}