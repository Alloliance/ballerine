import { Badge } from '@ballerine/ui';
import * as React from 'react';
import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { toTitleCase } from 'string-ts';
import { isValidUrl } from '@/common/utils/is-valid-url';

export const useCompanySanctionsBlock = companySanctions => {
  return useMemo(() => {
    if (!Array.isArray(companySanctions) || !companySanctions?.length) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: [
          ...createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'heading',
              value: 'Company Sanctions',
            })
            .addCell({
              type: 'container',
              value: createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'subheading',
                  value: 'Company check results',
                  props: {
                    className: 'text-lg my-4 block',
                  },
                })
                .addCell({
                  type: 'table',
                  value: {
                    columns: [
                      {
                        accessorKey: 'totalMatches',
                        header: 'Total matches',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <Badge
                              variant={'warning'}
                              className={`mb-1 rounded-lg px-2 py-1 font-bold`}
                            >
                              {value} {value === 1 ? 'match' : 'matches'}
                            </Badge>
                          );
                        },
                      },
                      {
                        accessorKey: 'fullReport',
                        header: 'Full report',
                      },
                    ],
                    data: [
                      {
                        totalMatches: companySanctions?.length,
                        fullReport: companySanctions,
                      },
                    ],
                  },
                })
                .build()
                .flat(1),
            })
            .build()
            .flat(1),
          ...companySanctions?.flatMap((sanction, index) =>
            createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'container',
                value: createBlocksTyped()
                  .addBlock()
                  .addCell({
                    type: 'subheading',
                    value: `Match ${index + 1}`,
                    props: {
                      className: 'text-lg block ms-2 mb-6',
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'mb-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'primaryName',
                          header: 'Primary name',
                        },
                        {
                          accessorKey: 'lastReviewed',
                          header: 'Last reviewed',
                        },
                      ],
                      data: [
                        {
                          primaryName: sanction?.primaryName,
                          lastReviewed: sanction?.lastReviewed,
                        },
                      ],
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'label',
                          header: 'Labels',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <div className={'flex space-x-2'}>
                                <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                                <span>{value}</span>
                              </div>
                            );
                          },
                        },
                      ],
                      data: sanction?.labels?.map(label => ({ label })),
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'reasonForMatch',
                          header: 'Reasons for Match',
                        },
                      ],
                      data: sanction?.reasonsForMatch?.map(reasonForMatch => ({
                        reasonForMatch: toTitleCase(reasonForMatch),
                      })),
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                        cell: {
                          className: 'break-all w-[60ch]',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'source',
                          header: 'Sources',
                        },
                      ],
                      data: sanction?.sources
                        ?.map(({ url: source }) => ({ source }))
                        // TODO: Research why zod's url validation fails on some valid urls.
                        ?.filter(({ source }) => isValidUrl(source)),
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'alternativeNames',
                          header: 'Alternative names',
                        },
                      ],
                      data: [
                        {
                          alternativeNames: sanction?.alternativeNames,
                        },
                      ],
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'officialList',
                          header: 'Official lists',
                        },
                      ],
                      data: sanction?.officialLists?.map(({ description: officialList }) => ({
                        officialList,
                      })),
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'furtherInformation',
                          header: 'Further information',
                        },
                      ],
                      data: sanction?.furtherInformation?.map(furtherInformation => ({
                        furtherInformation,
                      })),
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'linkedIndividual',
                          header: 'Linked individual',
                        },
                        {
                          accessorKey: 'description',
                          header: 'Description',
                        },
                      ],
                      data: sanction?.linkedIndividuals?.map(
                        ({ firstName, middleName, lastName, description }) => ({
                          linkedIndividual: `${firstName}${
                            middleName ? `${middleName} ` : ''
                          } ${lastName}`,
                          description,
                        }),
                      ),
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'country',
                          header: 'Linked address',
                        },
                        {
                          accessorKey: 'city',
                          header: 'City',
                        },
                        {
                          accessorKey: 'linkedAddress',
                          header: 'Address',
                        },
                      ],
                      data: sanction?.places?.map(({ country, city, address }) => ({
                        linkedAddress: address || 'N/A',
                        city: city || 'N/A',
                        country: country || 'N/A',
                      })),
                    },
                  })
                  .build()
                  .flat(1),
              })
              .build()
              .flat(1),
          ),
        ],
      })
      .build();
  }, [companySanctions]);
};
