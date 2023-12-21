import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async ({ searchParams }: SearchParamProps) => {

    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    const ordersPage = Number(searchParams?.ordersPage) || 1;
    const eventsPage = Number(searchParams?.ordersPage) || 1;

    const orders = await getOrdersByUser({ userId, page: ordersPage })

    const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
    const organizedEvents = await getEventsByUser({ userId, page: eventsPage })

    return (
        <>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>Minhas compras</h3>
                    <Button asChild className='button hidden sm:flex' size="lg">
                        <Link href="/#events">
                            Explorar mais eventos
                        </Link>
                    </Button>
                </div>
            </section>

            <section className='wrapper my-8'>
                <Collection
                    data={orderedEvents}
                    emptyTitle="Você não comprou entradas para nenhum evento"
                    emptyStateSubtext="Explore por mais eventos"
                    collectionType="All_Events"
                    limit={3}
                    page={ordersPage}
                    urlParamName="odersPage"
                    totalPages={orders?.totalPages}
                />
            </section>

            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>Eventos organizados</h3>
                    <Button asChild className='button hidden sm:flex' size="lg">
                        <Link href="/events/create">
                            Criar novo evento
                        </Link>
                    </Button>
                </div>
            </section>

            <section className='wrapper my-8'>
                <Collection
                    data={organizedEvents?.data}
                    emptyTitle="Você não criou nenhum evento"
                    emptyStateSubtext="Aproveite e crie agora mesmo"
                    collectionType="Events_Organized"
                    limit={3}
                    page={eventsPage}
                    urlParamName="eventsPage"
                    totalPages={organizedEvents?.totalPages}
                />
            </section>
        </>
    )
}

export default ProfilePage